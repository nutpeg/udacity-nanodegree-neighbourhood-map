// Constructor function for a Location object for which each
// property is observable.
myApp.Location = function(data) {
  this.id = ko.observable(data.id);
  this.name = ko.observable(data.name);
  this.type = ko.observable(data.type);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.reviewCount = ko.observable(0);
  this.displayAddress = ko.observable([]);
  this.displayPhone = ko.observable('');
  this.url = ko.observable('');
  this.isClosed = ko.observable(true);
  this.rating = ko.observable(0);
  this.reviewCount = ko.observable('');
  this.snippetImageURL = ko.observable('');
  this.snippetText = ko.observable('');
};

// Pass initial data into the view model.
myApp.ViewModel = function(initData) {
  var self = this;

  // Captures state of side menu (open/closed).
  // Side menu is open on app load.
  this.menuOpen = ko.observable(true);

  // Controls opening and closing of side menu.
  this.toggleMenuOpen = function() {
    self.menuOpen() ? self.menuOpen(false) : self.menuOpen(true)
  };

  // Capture state of callback to external API (Yelp).
  self.ajaxSuccess = ko.observable(false);
  self.isLoading = ko.observable(false);

  // When no location is selected, `selectedLocation` needs to be
  // set to a null object, specified here.
  this.nullLocationObject = {
    id: function() {
      return null;
    },
    name: function() {
      return null;
    },
    type: function() {
      return null;
    },
    lat: function() {
      return null;
    },
    lng: function() {
      return null;
    },
    displayAddress: function() {
      return null;
    },
    displayPhone: function() {
      return null
    },
    url: function() {
      return null;
    },
    isClosed: function() {
      return null;
    },
    rating: function() {
      return null
    },
    reviewCount: function() {
      return null
    },
    snippetText: function() {
      return null;
    },
    snippetImageURL: function() {
      return null;
    }
  };

  // `selectedLocation` is initialised. Can be set to a given location by
  // - clicking on a location in the locations list
  // - clicking on a marker in the map
  this.selectedLocation = ko.observable(self.nullLocationObject);

  // Center the map on the given coords.
  this.panMap = function(coords) {
    myApp.map.panTo(coords);
  };

  // Set a new `selectedLocation` if clicked for first time, or
  // unselect existing location if clicked a second time. 
  this.setLocation = function(location, e) {
    var selectedId = self.selectedLocation().id();
    var lat = location.lat();
    var lng = location.lng();

    // Check to see if currently selected location is selected again
    // so should be toggled off, which closes the info pane.
    // Click could have been on: 
    // - the list item
    // - the info pane close button
    // - the corresponding map marker
    if (selectedId === location.id()) {
      // Same location selected again, so reset selectedLocation
      // to the null location object. This will trigger the info pane
      // to close, and the location to be unselected.
      self.selectedLocation(self.nullLocationObject);
      // Pan map back to center
      self.panMap(myApp.MAP_CENTER);
    } else {
      // Different location selected, so update selectedLocation.
      self.selectedLocation(location);
      self.ajaxSuccess(false);
      // Pan map to center over selected marker.
      self.panMap({
        lat: lat,
        // Take into account space taken by info pane
        lng: lng + myApp.MAP_OFFSET
      });
      // Turn on loading spinner ready for request
      self.isLoading(true);
      // Fetch yelp data
      myApp.request_yelp({
        term: location.name(),
        cll: lat + ',' + lng
      }, self.yelp_success_callback, self.yelp_failure_callback);
    }
  };

  // Success callback for call to yelp API.
  this.yelp_success_callback = function(results) {
    // Set state for tracking success of API call.
    // This triggers hiding the spinner.
    self.isLoading(false);
    // This triggers visibility of the appropriate part of
    // the info window.
    self.ajaxSuccess(true);
    // Capture results from API call.
    if (results.businesses[0]) {
      self.selectedLocation().displayAddress(results.businesses[0].location.display_address);
      self.selectedLocation().displayPhone(results.businesses[0].display_phone);
      self.selectedLocation().url(results.businesses[0].url);
      self.selectedLocation().isClosed(results.businesses[0].is_closed);
      self.selectedLocation().rating(results.businesses[0].rating);
      self.selectedLocation().reviewCount(results.businesses[0].review_count);
      self.selectedLocation().snippetText(results.businesses[0].snippet_text);
      self.selectedLocation().snippetImageURL(results.businesses[0].snippet_image_url);
    }
  };

  // Failure callback for call to yelp API.
  this.yelp_failure_callback = function() {
    // Need to set both success and failure as Yelp API can 'succeed'
    // by sending back a JSON response object which specifies the error
    // made in the call.
    self.isLoading(false);
    self.ajaxSuccess(false);
  };

  // isFailed set to `true` when no longer loading and call to Yelp API
  // has returned an error.
  this.isFailed = ko.computed(function() {
    return !self.isLoading() && !self.ajaxSuccess();
  });

  // Use rating from API call (to Yelp) to set appropriate class
  // for selected location's star rating image.
  this.rating = ko.computed(function() {
    var rating = self.selectedLocation().rating();
    if (rating) {
      return 'stars_' + rating.toString().replace('.', 'point');
    }
  });

  // Initialize set of filters.
  this.filters = ko.observableArray([]);

  // Capture state of filters. If any filters have been input, then
  // this will trigger showing list of applied filters.
  this.filterOn = ko.computed(function() {
    return (self.filters().length !== 0);
  });

  // Capture text from filter input.
  this.filterText = ko.observable('');

  // Initialise set of locations that will correspond to filters
  // applied.
  this.filteredLocations = ko.observableArray([]);

  // For each filtering operation, start with a clean set of all
  // locations before filtering.
  this.loadFilteredLocations = function(data) {
    // Remove all current locations form filtered set.
    self.filteredLocations.removeAll();
    // Add a new Location object for each location, based on data
    // passed in (always the original data).
    data.forEach(function(location) {
      self.filteredLocations.push(new myApp.Location(location));
    });
  };

  // Filter the set of locations based on applied filters.
  // Use unfiltered set of locations as starting set.
  this.filterLocations = ko.computed(function() {
    // set filteredLocations to original data
    self.loadFilteredLocations(initData);
    // If filters are present, create a new set of `filteredLocations`
    if (self.filters().length > 0) {
      self.filters().forEach(function(filter) {
        var newFilteredLocations;
        newFilteredLocations = self.filteredLocations().filter(function(location) {
          // Check filter text is in the location name...
          var inName = location.name().toLowerCase().includes(filter);
          // ...or is in the location type.
          var inType = location.type().toLowerCase().includes(filter);
          // If in either the name or the location, keep that location in the
          // list of filtered locations.
          return inName || inType;
        });
        self.filteredLocations(newFilteredLocations);
      });
    }
  });

  // Add filter from input field to list of applied location filters.
  this.addFilter = ko.observable(function() {
    // Get the filter text from the input control.
    var text = self.filterText().toLowerCase();
    // If filter has already been applied then don't add it to set of
    // filters, otherwise do.
    if (text && !self.filterExists(text)) {
      self.filters.push(text);
    }
    // Remove text from input control.
    self.filterText('');
    // If the location info window is open, close it
    self.selectedLocation(self.nullLocationObject);
  });

  // Check to see if user has input a filter that already exists
  this.filterExists = function(text) {
    return self.filters().includes(text);
  };

  // Remove filter from list of filtered locations and re-filter
  // locations based on new set of filters.
  this.removeFilter = function(filter) {
    self.filters.remove(filter);
    // Re-filter locations with remaining filters.
    self.filterLocations();
    // If the location info window is open, close it, because the
    // location may have been filtered out in the latest operation.
    self.selectedLocation(self.nullLocationObject);
  };

  // Initialise null marker object for map markers.
  this.nullMarkerObject = {
    id: null,
    marker: null
  };

  // Initialise selected marker to null object (as no marker
  // has been selected yet).
  this.selectedMarker = ko.observable(self.nullMarkerObject);

  // Select
  this.selectMarker = ko.computed(function() {
    var marker = self.selectedMarker().marker;
    var id = self.selectedLocation().id();
    // Cancel existing animation (bouncing) on previously chosen marker
    if (marker) {
      marker.setAnimation(null);
    }
    // Loop through all markers to find match for selectedLocation
    if (id !== null) {
      var chosen = myApp.markers.filter(function(marker) {
        return marker.id === id;
      });
      self.selectedMarker(chosen[0]);
    } else {
      // Reset selected marker to 'nothing', i.e. a null marker.
      self.selectedMarker(self.nullMarkerObject);
    }
  });

  // Animate marker (bouncing).
  this.startMarkerAnimation = ko.computed(function() {
    var marker = self.selectedMarker();
    // Animate the marker and set it to stop animating after 2.8s
    if (marker.id !== null) {
      marker.marker.setAnimation(google.maps.Animation.BOUNCE);
      // stop animation after 2.8s
      self.stopMarkerAnimation(marker.marker, 2800)
    }
  });

  // Stop marker animating after the given delay
  this.stopMarkerAnimation = function(marker, delay) {
    setTimeout(function() {
      marker.setAnimation(null);
    }, delay);
  };

  // When clicking on a marker, the corresponding location in the
  // side menu list may be below the browser window. Should scroll
  // into view. But...
  // ...maybe implement this later?
  // this.getDistanceFromTop = function(el) {
  //   console.log(el.getBoundingClientRect().top);
  // };

};

myApp.vm = new myApp.ViewModel(myApp.locationData);

myApp.mapSuccess = function() {
  ko.applyBindings(myApp.vm);
};

myApp.mapFailure = function() {
  $('.container')
      .addClass('failure_notice')
      .text('Sorry, but the Google map failed to load. Please try again later.');
};


