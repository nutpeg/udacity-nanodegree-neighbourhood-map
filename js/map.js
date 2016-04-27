
function initMap() {
  myApp.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.512, lng: -0.119},
    zoom: 13
  });
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(51.513477, -0.136523),
    map: myApp.map,
    title: "Here"
  });
}