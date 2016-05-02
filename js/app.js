myApp.ViewModel = function(initData) {
  var self = this;

  this.menuOpen = ko.observable(true);
  this.selectedLocation = ko.observable({ id: null });
  this.selectedMarker = ko.observable({
    id: null,
    marker: null
  });

  this.selectMarker = ko.computed(function() {
    var id = self.selectedLocation().id;
    var markers = myApp.markers;

    if (id !== null) {
      // Loop through all markers to find match for selectedLocation
      var chosen = markers.filter(function(marker) {
        return marker.id === id;
      });
      self.selectedMarker(chosen[0]);
    } else {
      
      self.selectedMarker({
        id: null,
        marker: null
      });
    }
  });
  this.filters = ko.observableArray([]);
  this.filterOn = ko.computed(function() {
    return (self.filters().length !== 0);
  });
  this.filterText = ko.observable('');
  this.filteredLocations = ko.observableArray(initData);

  this.toggleMenuOpen = function() {
    self.menuOpen() ? self.menuOpen(false) : self.menuOpen(true)
  };


  this.filterLocations = function() {
    // set filteredLocations to original data
    self.filteredLocations(initData);
    // add new filter to filters
    var text = self.filterText().toLowerCase();
    if (text) {
      self.addFilter(text);
    }
    // If filters are present, create a new set of `filteredLocations`
    // TODO: can this be triggered by subscribing to `filterOn`
    // using `.extend{notify: 'always'}`?
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
  };

  this.addFilter = function(text) {
    if (!self.filterExists(text)) {
      self.filters.push(text);
    }
    self.filterText('');
  };

  this.filterExists = function(text) {
    return self.filters().includes(text);
  };

  this.removeFilter = function(filter) {
    self.filters.remove(filter);
    self.filterLocations();
  };

  this.toggleSelectedLocation = function(location) {
    var selectedId = self.selectedLocation().id;
    if (selectedId === location.id) {
      self.selectedLocation({ id: null });
    } else {
      self.selectedLocation(location);
    }
  };

  this.animateMarker = ko.computed(function() {
    var marker = self.selectedMarker();
    console.log(marker);
    if (marker.id === null) {

    } else {
      marker.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  });

};

ko.applyBindings(new myApp.ViewModel(myApp.locationData));


