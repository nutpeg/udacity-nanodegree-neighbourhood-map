/* require the libraries needed */
var nonce = myApp.nonce();
// var qs = myApp.queryString;

/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */
myApp.request_yelp = function(set_parameters, cbSuccess, cbFailure) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'https://api.yelp.com/v2/search/';

  /* We can setup default parameters here */
  var default_parameters = {
    location: 'London',
    cc: 'GB',
    limit: 3
  };

  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : myApp.yelp.YELP_KEY,
    oauth_token : myApp.yelp.YELP_TOKEN,
    oauth_nonce : nonce(),
    oauth_timestamp : nonce().toString().substr(0,10),
    oauth_signature_method : myApp.yelp.YELP_SIGNATURE_METHOD,
    oauth_version : '1.0',
    callback: 'cb'
  };

  /* We combine all the parameters in order of importance */
  var parameters = _.assign(default_parameters, set_parameters, required_parameters);

  /* We set our secrets here */
  var consumerSecret = myApp.yelp.YELP_CONSUMER_SECRET;
  var tokenSecret = myApp.yelp.YELP_TOKEN_SECRET;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod,
      url,
      parameters,
      consumerSecret,
      tokenSecret,
      { encodeSignature: false}
  );

  /* We add the signature to the list of parameters */
  parameters.oauth_signature = signature;

  /* Set up parameters for ajax call using jQuery.
   * (Thanks to Udacity forums for details on setting cache to true
   * see: https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/5?u=tim_1810783084
   * */
  var requestParams = {
    url: url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: cbSuccess,
    error: cbFailure
  };

  /* Then use jQuery to make the ajax API Request */
  $.ajax(requestParams);
};
