// Function to create a random string for YELP API.
myApp.nonce = function(length) {
  var last = null;
  var repeat = 0;

  if (typeof length == 'undefined') length = 15;

  return function() {
    var now = Math.pow(10, 2) * +new Date();

    if (now == last) {
      repeat++
    } else {
      repeat = 0;
      last = now;
    }

    var s = (now + repeat).toString();
    return +s.substr(s.length - length);
  };
};
