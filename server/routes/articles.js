var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var NodeCache = require( "node-cache" );
var _ = require('lodash');
var request = require('request');

var myCache = new NodeCache();

function getRssFeed(rssUri, feedData, finish) {
  var cachedResult = myCache.get(rssUri);
  if (cachedResult) {
    console.log('Using cached result');
    feedData.push(cachedResult);
    finish();
    return;
  }

  request(rssUri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        //console.dir(result);
        if (!result || !("rss" in result)) {
          console.log("RSS URI is invalid: " + rssUri);
          feedData.push({});
          finish();
        } else {
          var returnValue = result["rss"]["channel"][0];
          var oneHour = 60 * 60;
          myCache.set(rssUri, returnValue, oneHour);
          feedData.push(returnValue);
          finish();
        }
      });
    }
  })
}

function getRssFeeds(rssUris, res) {
  var feedData = [];

  var finish = _.after(rssUris.length, function(data) {
    console.log('finishing');
    res.json(feedData);
  });

  for (var x = 0; x < rssUris.length; x++) {
    var rssUri = rssUris[x];
    getRssFeed(rssUri, feedData, finish);
  }
}

/* GET home page. */
router.post('/', function(req, res, next) {
  getRssFeeds(req.body.rssUris, res);
});

module.exports = router;
