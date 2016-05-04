myApp.ViewModel = function(initData) {
  var self = this;

  this.menuOpen = ko.observable(true);

  this.toggleMenuOpen = function() {
    self.menuOpen() ? self.menuOpen(false) : self.menuOpen(true)
  };

  this.selectedLocation = ko.observable({ id: null });
  
  this.panMap = function(coords) {
    myApp.map.panTo(coords)
  }

  // Set a new `selectedLocation` if clicked for first time, or
  // unselect existing location if clicked a second time. 
  this.setLocation = function(location) {
    var selectedId = self.selectedLocation().id;
    var lat = location.lat;
    var lng = location.lng;
    if (selectedId === location.id) {
      self.selectedLocation({ id: null });
      self.panMap(myApp.MAP_CENTER);
    } else {
      self.selectedLocation(location);
      self.panMap({
        lat: lat,
        lng: lng + myApp.MAP_OFFSET
      });
    }
  };

  this.filters = ko.observableArray([]);

  this.filterOn = ko.computed(function() {
    return (self.filters().length !== 0);
  });

  this.filterText = ko.observable('');

  this.filteredLocations = ko.observableArray(initData);

  // Filter the set of locations based on applied filters.
  // Use unfiltered set of locations as starting set.
  this.filterLocations = ko.computed(function() {
    // set filteredLocations to original data
    self.filteredLocations(initData);
    // If filters are present, create a new set of `filteredLocations`
    if (self.filters().length > 0) {
      self.filters().forEach(function(filter) {
        var newFilteredLocations;
        newFilteredLocations = self.filteredLocations().filter(function(location) {
          var inName = location.name.toLowerCase().includes(filter);
          var inType = location.type.toLowerCase().includes(filter);
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
  };

  this.nullMarkerObject = {
    id: null,
    marker: null
  };

  this.selectedMarker = ko.observable(self.nullMarkerObject);

  this.selectMarker = ko.computed(function() {
    var marker = self.selectedMarker().marker;
    var id = self.selectedLocation().id;
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

  

};

ko.applyBindings(new myApp.ViewModel(myApp.locationData));


