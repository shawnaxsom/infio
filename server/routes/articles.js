var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

/* GET home page. */
router.get('/', function(req, res, next) {
  var request = require('request');
  request('http://www.techmeme.com/feed.xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        //console.dir(result);
        res.json(result["rss"]["channel"][0]);
      });
    }
  })
});

module.exports = router;
