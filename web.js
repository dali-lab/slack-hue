var express = require("express");
var logfmt = require("logfmt");
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies
var http = require('http'); //the variable doesn't necessarily have to be named http

app.use(logfmt.requestLogger());


var options = {
  host: '129.170.212.42',
  port: 80,
  path: '/api/newdeveloper/groups/0/action',
  method: 'PUT'
};



var onData = {
  on: true,
  // hue: 65535,
  // bri: 255
};
var offData = {
  on: false,
};

var onData = {
  on: true,
  // hue: 65535,
  // bri: 255
};

var partyData = {
  on: true,
  effect: 'colorloop'
};

var brightData = {
  on: true,
  bri: 255,
};
var mediumBrightData = {
  on: true,
  bri: 200,
};

var dimData = {
  on: true,
  bri: 100,
};
// request.write(JSON.stringify(data));
// request.end();

function intForColor(color){

}

function lightsWithData(data){
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
	request.write(JSON.stringify(data));
	request.end();
}

app.post('/', function(req,res){
	
	var text = req.body.text;
	if( text =='on') {		
		lightsWithData(onData);
		res.send('lights on');	
	}
	else if (text == 'off'){
		lightsWithData(offData);
		res.send('lights off');	
	}
	else if (text == 'party'){
		lightsWithData(partyData);
		res.send('party!');	
	}
	else if (text == 'dim'){
		lightsWithData(brightData);
		res.send('dimmed ;)');	
	}
	else if (text == 'bright'){
		lightsWithData(mediumBrightData);
		res.send('bightened');	
	}
	else if (text == 'shady'){
		lightsWithData(mediumBright);
		res.send('shady');	
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
