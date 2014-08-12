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

request.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

var data = {
  on: true,
  hue: 65535
};
request.write(JSON.stringify(data));
request.end();

app.post('/', function(req,res){
	 console.log(req);
	var text = req.text;
   
	
	if( text =='on') {
		// write data to request body
		request.write(JSON.stringify(data));
		request.end();
		res.send('lights on');	
	}
	else if (text == 'off'){
		res.send('lights off');	
	}
	else{
		res.send('invalid command');	
	}
	
	
});

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
