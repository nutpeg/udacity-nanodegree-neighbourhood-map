ko.bindingHandlers.map = {
  init: function(element, valueAccessor) {
    myApp.map = new google.maps.Map(element, {
      center: { lat: 51.498494, lng: -0.133475 },
      zoom: 13
    });
  },

  markers: myApp.markers,

  update: function(element, valueAccessor) {
    var value = valueAccessor();
    
    // Remove all markers from the map.
    ko.bindingHandlers.map.clearMarkers();

    // Loop through filtered locations to add marker to map
    // for each.
    // value.locations() contains all filtered locations.
    value.locations().forEach(function(location) {
      var lat = location.lat;
      var lng = location.lng;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: myApp.map,
        title: location.name
      });
      
      // Add marker to markers array to enable later removal
      // in `clearMarkers` function.
      ko.bindingHandlers.map.markers.push({
        marker: marker,
        id: location.id
      });
    });
  },

  clearMarkers: function() {
    var currentMarkers = ko.bindingHandlers.map.markers;
    currentMarkers.forEach(function(marker) {
      return marker.marker.setMap(null);
    });
    currentMarkers = [];
  }

};
