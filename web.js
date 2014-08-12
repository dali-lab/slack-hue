var express = require("express");
var logfmt = require("logfmt");
var app = express();
var http = require('http'); //the variable doesn't necessarily have to be named http

app.use(logfmt.requestLogger());


var options = {
  host: '129.170.212.42',
  port: 80,
  path: '/api/newdeveloper/groups/0/action',
  method: 'PUT'
};

var request = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

var data = {
  on: true,
  hue: 65535
};
// write data to request body
req.write(JSON.stringify(data));
req.end();

app.post('/', function(req,res){
    
	res.send('Hello POST!');	
});

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
