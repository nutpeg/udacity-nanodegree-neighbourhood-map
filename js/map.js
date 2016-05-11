ko.bindingHandlers.map = {
  init: function(element, valueAccessor) {
      myApp.map = new google.maps.Map(element, {
        center: myApp.MAP_CENTER,
        zoom: 13
      });
  },

  update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
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
        var contentString = '<h3>' + location.name + '</h3>' +
            '<div>Click marker for more info</div>';

        var infoWindow = new google.maps.InfoWindow({
          content: contentString
        });

        // Show mini info window on marker mouseover.
        marker.addListener('mouseover', function() {
          infoWindow.open(marker.map, marker);
        });
        marker.addListener('mouseout', function() {
          infoWindow.close();
        });
        // Open Info panel on marker click.
        marker.addListener('click', function() {
          bindingContext.$root.setLocation(location);
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
