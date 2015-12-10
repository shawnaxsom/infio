var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var NodeCache = require( "node-cache" );

var myCache = new NodeCache();

/* GET home page. */
router.post('/', function(req, res, next) {
  var cachedResult = myCache.get(req.body.rssUri);
  if (cachedResult) {
    console.log('Using cached result');
    res.json(cachedResult);
    return;
  }

  var request = require('request');
  request(req.body.rssUri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        //console.dir(result);
        if (!result || !("rss" in result)) {
          console.log("RSS URI is invalid: " + req.body.rssUri);
          res.json({});
        } else {
          var returnValue = result["rss"]["channel"][0];
          var oneHour = 60 * 60;
          myCache.set(req.body.rssUri, returnValue, oneHour);
          res.json(returnValue);
        }
      });
    }
  })
});

module.exports = router;
