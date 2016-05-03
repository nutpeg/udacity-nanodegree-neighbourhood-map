ko.bindingHandlers.map = {
  init: function(element, valueAccessor) {
    myApp.map = new google.maps.Map(element, {
      center: { lat: 51.498494, lng: -0.133475 },
      zoom: 13
    });
  },

  update: function(element, valueAccessor) {
    // Remove all markers from the map.
    ko.bindingHandlers.map.clearMarkers();
    // Loop through filtered locations to add marker to map.
    // `valueAccessor.locations()` contains all filtered locations.
    valueAccessor().locations().forEach(function(location) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: myApp.map,
        title: location.name
      });
      // Add marker to markers array to enable later removal
      // in `clearMarkers` function.
      myApp.markers.push({
        marker: marker,
        id: location.id
      });
    });
  },

  clearMarkers: function() {
    myApp.markers.forEach(function(marker) {
      marker.marker.setMap(null);
    });
    myApp.markers = [];
  }

};
