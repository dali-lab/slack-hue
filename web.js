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

var NUM_LIGHTS = 15;

var options = {
  host: '129.170.212.42',
  port: 80,
  path: '/api/newdeveloper/groups/0/action',
  method: 'PUT'
};

var shouldTV = false;

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
};

var partyData = {
  on: true,
  effect: 'colorloop',
};

var brightData = {
  on: true,
  bri: 255,
};
var mediumBrightData = {
  on: true,
  bri: 200,
  
};

var lessDimData = {
  on: true,
  bri: 150,
  
};

var dimData = {
  on: true,
  bri: 100,
};

var redData = {
  on: true,
  hue:0,
  sat: 255,
  effect: 'none'
};

var orangeData = {
  on: true,
  hue:13000,
  sat: 255,
  effect: 'none',
};
var greenData = {
  on: true,
  hue:25500,
  sat: 255,
  effect: 'none',
};

var pulseData = {
  alert: 'lselect'
};

var normalData = {
	  on: true,
	  hue:15000,
	  sat: 200,
	  effect: 'none',
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

var blueData = {
    on: true,
	hue: 46920,
	sat: 255,
};

var purpleData = {
    on: true,
	hue: 50000,
	sat: 255,
};
// request.write(JSON.stringify(data));
// request.end();

function intForColor(color){

}

function lightWithDataAndNumber(data,number){
	
	var options2 = {
	  host: '129.170.212.42',
	  port: 80,
	  path: '/api/newdeveloper/lights/'+number+'/state',
	  method: 'PUT'
	};
	
	var request = http.request(options2, function(res) {
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
	
	if (text != 'tv'){
		shouldTV = false;
	}
	
	var text = req.body.text;
	if( text =='on') {		
		lightsWithData(onData);
		res.send('lights on');	
	}
	else if (text == 'tv'){
		shouldTV = true;
		res.send('tv');	
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
		lightsWithData(lessDimData);
		res.send('dimmed');	
	}
	else if (text == 'dimmer'){
		lightsWithData(dimData);
		res.send('dimmed ;)');	
	}
	else if (text == 'shady'){
		lightsWithData(mediumBrightData);
		res.send('shady');	
	}
	else if (text == 'shady'){
		lightsWithData(mediumBrightData);
		res.send('shady');	
	}
	else if (text == 'bright'){
		lightsWithData(brightData);
		res.send('bightened');	
	}
	else if (text == 'sauron'){
		lightsWithData(redData);
		res.send('sauron');	
	}
	else if (text == 'blue'){
		lightsWithData(blueData);
		res.send('blue');	
	}
	else if (text == 'orange'){
		lightsWithData(orangeData);
		res.send('orange');	
	}
	else if (text == 'green'){
		lightsWithData(greenData);
		res.send('green');	
	}
	else if (text == 'normal'){
		lightsWithData(normalData);
		res.send('normal');	
	}
	else if (text == 'purple'){
		lightsWithData(purpleData);
		res.send('purple');	
	}
	else if (text == 'pulse'){
		lightsWithData(pulseData);
		res.send('pulse');	
	}
	else if (text == 'random'){
		
		for(i =0; i<NUM_LIGHTS; i++){	
			var tempData = {
				on: true,
				hue: getRandomArbitrary(0,65535),
				sat: getRandomArbitrary(130,255)
			};
			console.log(tempData);
		lightWithDataAndNumber(tempData	,i);
		}
		res.send('~*$random!@#~')
	}
	else if (text == 'colors'){
		
		for(i =0; i<NUM_LIGHTS; i++){	
			var tempData = {
				on: true,
				hue: getRandomArbitrary(0,65535),
				sat: getRandomArbitrary(220,255)
			};
			console.log(tempData);
		lightWithDataAndNumber(tempData	,i);
		}
		res.send('~*$random colors!@#~')
	}
	else{
		res.send('/lights commands: on, off, random, dim, dimmer, shady, bright, blue, green, orange, purple, normal, colors, sauron, party, pulse, tv');	
	}
	
	
});

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/tv/', function(req, res) {
  res.send(shouldTV);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
