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

myApp.ViewModel = function(initData) {
  var self = this;

  this.menuOpen = ko.observable(true);

  this.toggleMenuOpen = function() {
    self.menuOpen() ? self.menuOpen(false) : self.menuOpen(true)
  };

  self.ajaxSuccess = ko.observable(false);

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
    // - the corresponding marker
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
      // fetch yelp data
      myApp.request_yelp({
        term: location.name(),
        cll: lat + ',' + lng
      }, self.yelp_success_callback, self.yelp_failure_callback );
    }
  };


  this.yelp_success_callback = function(results) {
    self.ajaxSuccess(true);
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

  this.yelp_failure_callback = function() {
    console.log('Failed to load');
    self.ajaxSuccess(false);
  };

  this.rating = ko.computed(function() {
    var rating = self.selectedLocation().rating();
    if (rating) {
      return 'stars_' + rating.toString().replace('.', 'point');
    }
  });

  this.filters = ko.observableArray([]);

  this.filterOn = ko.computed(function() {
    return (self.filters().length !== 0);
  });

  this.filterText = ko.observable('');

  this.filteredLocations = ko.observableArray([]);

  this.loadFilteredLocations = function(data) {
    self.filteredLocations.removeAll();
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
          var inName = location.name().toLowerCase().includes(filter);
          var inType = location.type().toLowerCase().includes(filter);
          return inName || inType;
        });
        self.filteredLocations(newFilteredLocations);
      });
    }
  });

  // Add filter from input field to list of applied location filters.
  this.addFilter = ko.observable(function() {
    var text = self.filterText().toLowerCase();
    if (text && !self.filterExists(text)) {
      self.filters.push(text);
    }
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
    self.filterLocations();
    // If the location info window is open, close it
    self.selectedLocation(self.nullLocationObject);
  };

  this.nullMarkerObject = {
    id: null,
    marker: null
  };

  this.selectedMarker = ko.observable(self.nullMarkerObject);

  this.selectMarker = ko.computed(function() {
    var marker = self.selectedMarker().marker;
    var id = self.selectedLocation().id();
    // Cancel existing animation on previously chosen marker
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

  this.startMarkerAnimation = ko.computed(function() {
    var marker = self.selectedMarker();
    // Animate the marker and set it to stop animating after 2.8s
    if (marker.id !== null) {
      marker.marker.setAnimation(google.maps.Animation.BOUNCE);
      // stop animation after 2.8s
      self.stopMarkerAnimation(marker.marker, 2800)
    }
  });

  this.stopMarkerAnimation = function(marker, delay) {
    setTimeout(function() {
      marker.setAnimation(null);
    }, delay);
  };

  this.getDistanceFromTop = function(el) {
    console.log(el.getBoundingClientRect().top);
  };

};

ko.applyBindings(new myApp.ViewModel(myApp.locationData));


