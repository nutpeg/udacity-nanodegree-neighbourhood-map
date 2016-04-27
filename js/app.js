$(document).ready(function() {
  $('.icon-menu').click(function() {
    $(this).toggleClass('open');
    $('.sidebar').toggleClass('open');
    $('.content').toggleClass('open');
  });
});

var markerData = [
  {
    name: "Tapas Brindisa Soho",
    type: "Tapas bar"
  },
  {
    name: "Copita",
    type: "Tapas bar"
  },
  {
    name: "El Pirata of Mayfair",
    type: "Tapas bar"
  },
  {
    name: "Camino Kings Cross",
    type: "Tapas bar"
  },
  {
    name: "Navaro's",
    type: "Tapas bar"
  },
  {
    name: "Iberica Marylebone",
    type: "Tapas bar"
  },
  {
    name: "Spanish House London",
    type: "Language school"
  },
  {
    name: "Vamos Let's Learn Spanish",
    type: "Language school"
  },
  {
    name: "The Spanish Factory London",
    type: "Language school"
  },
  {
    name: "Spanish Connection Language School Ltd.",
    type: "Language school"
  },
  {
    name: "Lingua Diversa",
    type: "Language school"
  },
  {
    name: "The Spanish Consul",
    type: "Government"
  },
  {
    name: "Spanish Chamber of Commerce",
    type: "Government"
  },
  {
    name: "Spanish Embassy",
    type: "Government"
  },
  {
    name: "Spanish Education Office",
    type: "Government"
  },
  {
    name: "Pizarro",
    type: "Restaurant"
  },
  {
    name: "Hispania",
    type: "Restaurant"
  },
  {
    name: "Zorita's Kitchen",
    type: "Restaurant"
  },
  {
    name: "Sevilla Mia",
    type: "Music venue"
  }
];

var ViewModel = function(initData) {
  var self = this;

  this.map = "blalba";

  this.filters = ko.observableArray([]);
  this.filterOn = ko.computed(function() {
    return (self.filters().length !== 0);
  });
  this.filterText = ko.observable('');
  this.filteredMarkers = ko.observableArray(initData);


  this.filterMarkers = function() {
    // set filteredMarkers to original data
    self.filteredMarkers(initData);
    // add new filter to filters
    var text = self.filterText().toLowerCase();
    if (text) {
      self.addFilter(text);
    }
    // If filters are present, create a new set of `filteredMarkers`
    if (self.filters().length > 0) {
      self.filters().forEach(function(filter) {
        var newFilteredMarkers;
        newFilteredMarkers = self.filteredMarkers().filter(function(marker) {
          var inName = marker.name.toLowerCase().includes(filter);
          var inType = marker.type.toLowerCase().includes(filter);
          return inName || inType;
        });
        self.filteredMarkers(newFilteredMarkers);
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
    self.filterMarkers();
  };

  this.showMarker = function() {
    console.log('Marker clicked');
  };
};

ko.applyBindings(new ViewModel(markerData));
