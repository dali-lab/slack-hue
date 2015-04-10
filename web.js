// Nook Harquail
//

var express = require("express");
var logfmt = require("logfmt");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
var http = require('http'); //the variable doesn't necessarily have to be named http
app.use(logfmt.requestLogger());


var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState;

var displayResult = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
  console.log(err);
};

var hostname = "129.170.212.42",
  username = "ececaeb13474f4f324487f375198d7";
var api = new HueApi(hostname, username);

//group ids
var oscarLights = 2;
var centerLights = 3;
var tvLights = 4;
//


function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


var normalState = lightState.create().on().white(500, 100);
var onState = lightState.create().on();
var offState = lightState.create().off();
var partyState = lightState.create().on().colorLoop();
var dimmestState = lightState.create().bri(50);
var dimState = lightState.create().bri(100);
var shadyState = lightState.create().bri(150);
var brightState = lightState.create().bri(200);
var brightestState = lightState.create().bri(250);

app.post('/', function(req, res) {

  console.log('body: ' + req.body);
  console.log('text :' + req.body.text);


  var texts = req.body.text.split(" ");

  console.log("LENGTH: " + texts.length);

  //defines color
  var text = texts[0];
  console.log("COLOR:" + text);
  //defines lights controlled
  var text2 = texts[1];
  console.log("text2:" + text2);
  var lightsControlled;
  switch (text2) {
    case "oscar":
      lightsControlled = oscarLights;
      break;
    case "tv":
      lightsControlled = tvLights;
      break;
    case "table":
      lightsControlled = centerLights;
      break;
    default:
      lightsControlled = 0;
      break;

  }


  if (text != 'tv') {
    shouldTV = false;
  }

  if (text == 'on') {
    res.send('lights on');

    for (var i = 0; i < lightsControlled.length; i++) {
      lightWithDataAndNumber(onData, lightsControlled[i]);
    }

  } else if (text == 'tv') {
    shouldTV = true;
    res.send('tv');
  } else if (text == 'off') {
    
   api.setGroupLightState(lightsControlled, offState ) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
    res.send('lights off');
  } else if (text == 'party') {
   
   api.setGroupLightState(lightsControlled, partyState ) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
    res.send('party!');
  } else if (text == 'dim') {
  
   api.setGroupLightState(lightsControlled, dimState) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
  } else if (text == 'dimmest') {
    
   api.setGroupLightState(lightsControlled, dimmestState) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
    res.send('dimmed ;)');
  } else if (text == 'shady') {

   api.setGroupLightState(lightsControlled, shadyState) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
    res.send('shady');
  } else if (text == 'bright') {

   api.setGroupLightState(lightsControlled, brightState) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    
    res.send('bightened');
  } else if (text == 'brightest') {
   api.setGroupLightState(lightsControlled, brightestState) // provide a value of false to turn off
  .then(displayResult)
    .fail(displayError)
    .done();
    res.send('bightened!!');
  } else if (text == 'sauron') {
    console.log("SAURON");
    for (var i = 0; i < lightsControlled.length; i++) {
      //         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
      lightWithDataAndNumber(redData, lightsControlled[i]);
    }
    res.send('sauron');
  } else if (text == 'blue') {

    for (var i = 0; i < lightsControlled.length; i++) {
      //         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
      lightWithDataAndNumber(blueData, lightsControlled[i]);
    }

    res.send('blue');
  } else if (text == 'orange') {
    for (var i = 0; i < lightsControlled.length; i++) {
      //         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
      lightWithDataAndNumber(orangeData, lightsControlled[i]);
    }
    res.send('orange');
  } else if (text == 'green') {

    for (var i = 0; i < lightsControlled.length; i++) {
      //         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
      lightWithDataAndNumber(greenData, lightsControlled[i]);
    }
    res.send('green');

  } else if (text == 'normal') {
    
    api.setGroupLightState(lightsControlled, normalState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();
    res.send('normal');
  } else if (text == 'purple') {

    for (var i = 0; i < lightsControlled.length; i++) {
      //         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
      lightWithDataAndNumber(purpleData, lightsControlled[i]);
    }
    res.send('purple');
  } else if (text == 'pulse') {

    lightsWithData(pulseData);
    res.send('pulse');
  } else if (text == 'pulses') {

    lightsWithData(pulseManyData);

    res.send('pulses');
  } else if (text == 'sparkle') {

    for (i in lightsControlled) {
      lightWithDataAndNumber(pulseManyData, lightsControlled[i]);
    }
    res.send('sparkle');
  } else if (text == 'random') {

    for (var i = 0; i < lightsControlled.length; i++) {
      var tempData = {
        on: true,
        hue: getRandomArbitrary(0, 255),
        sat: getRandomArbitrary(130, 255)
      };
      console.log(tempData);
      lightWithDataAndNumber(tempData, lightsControlled[i]);
    }
    res.send('~*$random!@#~')
  } else if (text == 'colors') {

    for (var i = 0; i < lightsControlled.length; i++) {
      var tempData = {
        on: true,
        hue: getRandomArbitrary(0, 65535),
        sat: getRandomArbitrary(220, 255)
      };
      console.log(tempData);
      lightWithDataAndNumber(tempData, lightsControlled[i]);
    }
    res.send('~*$random colors!@#~')
  } else {
    res.send('/lights commands: on, off, random, dimmest, dim, shady, bright, brightest, blue, green, orange, purple, normal, colors, sauron, party, pulse, pulses.  Choose the side of the room: /lights colors tv, /lights colors table, /lights colors oscar');
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
