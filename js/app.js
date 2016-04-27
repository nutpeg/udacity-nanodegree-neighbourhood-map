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
    type: "Tapas bar",
    lat: 51.513477,
    lng: -0.136523
  },
  {
    name: "Copita",
    type: "Tapas bar",
    lat: 51.514556,
    lng: -0.136073
  },
  {
    name: "El Pirata of Mayfair",
    type: "Tapas bar",
    lat: 51.505050,
    lng: -0.148109
  },
  {
    name: "Camino Kings Cross",
    type: "Tapas bar",
    lat: 51.530961,
    lng: -0.121790
  },
  {
    name: "Navaro's",
    type: "Tapas bar",
    lat: 51.519954,
    lng: -0.136430
  },
  {
    name: "Iberica Marylebone",
    type: "Tapas bar",
    lat: 51.522504,
    lng: -0.143968
  },
  {
    name: "Spanish House London",
    type: "Language school",
    lat: 51.465480,
    lng: -0.133181
  },
  {
    name: "Vamos Let's Learn Spanish",
    type: "Language school",
    lat: 51.517932,
    lng: -0.119791
  },
  {
    name: "The Spanish Factory London",
    type: "Language school",
    lat: 51.525618,
    lng: -0.083637
  },
  {
    name: "Spanish Connection Language School Ltd.",
    type: "Language school",
    lat: 51.512019,
    lng: -0.139382
  },
  {
    name: "Lingua Diversa",
    type: "Language school",
    lat: 51.519746,
    lng: -0.118345
  },
  {
    name: "The Spanish Consulate",
    type: "Government",
    lat: 51.492146,
    lng: -0.161423
  },
  {
    name: "Spanish Chamber of Commerce",
    type: "Government",
    lat: 51.515739,
    lng: -0.153417
  },
  {
    name: "Spanish Embassy",
    type: "Government",
    lat: 51.497827,
    lng: -0.153618
  },
  {
    name: "Spanish Education Office",
    type: "Government",
    lat: 51.507361,
    lng: -0.195646
  },
  {
    name: "Pizarro",
    type: "Restaurant",
    lat: 51.498430,
    lng: -0.081318
  },
  {
    name: "Hispania",
    type: "Restaurant",
    lat: 51.512918,
    lng: -0.087704
  },
  {
    name: "Zorita's Kitchen",
    type: "Restaurant",
    lat: 51.510537,
    lng: -0.096821
  },
  {
    name: "Sevilla Mia",
    type: "Music venue",
    lat: 51.516914,
    lng: -0.132061
  }
];

var ViewModel = function(initData) {
  var self = this;

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

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.512, lng: -0.119},
    zoom: 13
  });
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(51.513477, -0.136523),
    map: map,
    title: "Here"
  });
}

