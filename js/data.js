var myApp = myApp || {};

myApp.markers = [];

myApp.MAP_CENTER = {
  lat: 51.512019,
  lng: -0.139382
};

myApp.MAP_OFFSET = -0.055;

myApp.locationData = [
  {
    name: "Tapas Brindisa Soho",
    type: "Tapas bar",
    lat: 51.513477,
    lng: -0.136523,
    id: 1
  },
  {
    name: "Copita",
    type: "Tapas bar",
    lat: 51.514556,
    lng: -0.136073,
    id: 2
  },
  {
    name: "El Pirata of Mayfair",
    type: "Tapas bar",
    lat: 51.505050,
    lng: -0.148109,
    id: 3
  },
  {
    name: "Camino Kings Cross",
    type: "Tapas bar",
    lat: 51.530961,
    lng: -0.121790,
    id: 4
  },
  {
    name: "Navaro's",
    type: "Tapas bar",
    lat: 51.519954,
    lng: -0.136430,
    id: 5
  },
  {
    name: "Iberica Marylebone",
    type: "Tapas bar",
    lat: 51.522504,
    lng: -0.143968,
    id: 6
  },
  {
    name: "Vamos Let's Learn Spanish",
    type: "Language school",
    lat: 51.517932,
    lng: -0.119791,
    id: 8
  },
  {
    name: "The Spanish Factory London",
    type: "Language school",
    lat: 51.525618,
    lng: -0.083637,
    id: 9
  },
  {
    name: "Spanish Connection Language School Ltd.",
    type: "Language school",
    lat: 51.512019,
    lng: -0.139382,
    id: 10
  },
  {
    name: "Lingua Diversa",
    type: "Language school",
    lat: 51.519746,
    lng: -0.118345,
    id: 11
  },
  {
    name: "The Spanish Consulate",
    type: "Government",
    lat: 51.492146,
    lng: -0.161423,
    id: 12
  },
  {
    name: "Spanish Chamber of Commerce",
    type: "Government",
    lat: 51.515739,
    lng: -0.153417,
    id: 13
  },
  {
    name: "Spanish Embassy",
    type: "Government",
    lat: 51.497827,
    lng: -0.153618,
    id: 14
  },
  {
    name: "Spanish Education Office",
    type: "Government",
    lat: 51.507361,
    lng: -0.195646,
    id: 15
  },
  {
    name: "Pizarro",
    type: "Restaurant",
    lat: 51.498430,
    lng: -0.081318,
    id: 16
  },
  {
    name: "Hispania",
    type: "Restaurant",
    lat: 51.512918,
    lng: -0.087704,
    id: 17
  },
  {
    name: "Zorita's Kitchen",
    type: "Restaurant",
    lat: 51.510537,
    lng: -0.096821,
    id: 18
  },
  {
    name: "Sevilla Mia",
    type: "Music venue",
    lat: 51.516914,
    lng: -0.132061,
    id: 19
  }
];

myApp.YELP_KEY = 'iCl5menNgm1T2aPhq60wew';
myApp.YELP_SECRET = 'AXYptHmGw6YGU56tOEWfQN_nlyw';
myApp.YELP_TOKEN = 'V-M7gr1U6mccxo-4eZODOsh_C56S1coj';
myApp.YELP_TOKEN_SECRET = 'DJDz3eWxCwzZKGtyENhuPfc9lB4';
myApp.YELP_

var parameters = {
      oauth_consumer_key: YELP_KEY,
      oauth_token: YELP_TOKEN,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
      location = '1032+Castro+Street%2C+Mountain+View',
    term = 'cafe',
    cll = '37.385083%2C-122.08460200000002'
};
