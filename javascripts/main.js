console.log('This would be the main JS file.');
var express = require('express'),
    request = require('request');

var app = express();

var facts = [
  "401 - This error happens when a website visitor tries to access a restricted web page but isn’t authorized to do so, usually because of a failed login attempt.",
  "400 - This is basically an error message from the web server telling you that the application you are using (e.g. your web browser) accessed it incorrectly or that the request was somehow corrupted on the way.",
  "403 - No login opportunity was available. This can for example happen if you try to access a (forbidden) directory on a website.",
  "404 - Happens when you try to access a resource on a web server (usually a web page) that doesn’t exist. Some reasons for this happening can for example be a broken link, a mistyped URL, or that the webmaster has moved the requested page somewhere else (or deleted it).",
  "500 - It’s a general-purpose error message for when a web server encounters some form of internal error. For example, the web server could be overloaded and therefore unable to handle requests properly." 
 
];

var external = [
  function catfacts(req, res) {
    request({
      url: 'http://theresaproblemwith.me',
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode == 200) {
        var facts = data.facts
          .map(function(fact) {
            return fact.replace(/\b([Cc])(ats?)\b/g, function(str, c, at) {
              var b = (c === "C") ? "B" : "b";
              return b + "earc" + at;
            });
          })
          .filter(function(fact) {
            return fact.length <= 160 && ~fact.toLowerCase().indexOf("cat");
          });

        if (!facts.length) {
          return catfacts(req, res);
        }

        res.send(facts[0]);
      }
    });
  }
];

app.get('/', function(req, res) {

  var r = ~~(Math.random() * (external.length * 3));
  if(r < external.length) {
    external[r](req, res);
    return;
  }
  var fact = facts[~~(Math.random() * facts.length)];
  res.send(fact);
});

app.get('/stress', function(req, res) {
  var hits = 0;
  var totalReqs = 0;
  var total = 1000;
  for(var i = 0; i < total; ++i) {
    request('http://localhost:5000/', function(error, response, data) {
      if(facts.indexOf(data) !== -1) {
        ++hits;
      }
      ++totalReqs;
      if(totalReqs == total) {
        console.log("Got " + hits + " from our facts.");
        console.log("Got " + (total - hits) + " from catfacts.");
        res.send("Done");
      }
    });
  }
});


var server = app.listen(5000, function() {
  console.log("Listening on port 5000");
});
