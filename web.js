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

var nametoHex = require('colornames');
var hexToRgb = require('hex-rgb');

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

var pulseState = lightState.create().alertShort();
var pulsesState = lightState.create().alertLong();

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}


function RGBtoHSB(r, g, b) {
  var hue, saturation, brightness;
  var hsbvals = Array();
  var cmax = (r > g) ? r : g;
  if (b > cmax) cmax = b;
  var cmin = (r < g) ? r : g;
  if (b < cmin) cmin = b;
  brightness = cmax;
  if (cmax != 0)
    saturation = (cmax - cmin) * 255 / cmax;
  else
    saturation = 0;
  //println(cmax);
  //println(cmin);
  if (saturation == 0)
    hue = DEFAULT_HUE;
  else {
    // Need to be fixed!
    var tempHue;
    var redc = ((cmax - r)) / ((cmax - cmin));
    var greenc = ((cmax - g)) / ((cmax - cmin));
    var bluec = ((cmax - b)) / ((cmax - cmin));
    if (r == cmax)
      tempHue = bluec - greenc;
    else if (g == cmax)
      tempHue = 2.0 + redc - bluec;
    else
      tempHue = 4.0 + greenc - redc;
    tempHue = tempHue / 6.0;
    if (tempHue < 0)
      tempHue = tempHue + 1.0;
    hue = (tempHue * 65535);
  }
  hsbvals[0] = hue;
  hsbvals[1] = saturation;
  hsbvals[2] = brightness;
  return hsbvals;
}


app.post('/', function(req, res) {

  console.log('body: ' + req.body);
  console.log('text :' + req.body.text);


  var texts = req.body.text.split(" ");

  console.log("LENGTH: " + texts.length);

  //defines color
  var text = texts[0];
  var hexFromText = nametoHex(text);
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

  var intFromText = parseInt(text, 10)

  if (text != 'tv') {
    shouldTV = false;
  }

  if (text == 'on') {

  api.setGroupLightState(lightsControlled, onState) 
  .then(displayResult)
    .fail(displayError)
    .done();

  res.send('lights on');

  } else if (text == 'tv') {
    shouldTV = true;
    res.send('tv');
  } else if (text == 'off') {

    api.setGroupLightState(lightsControlled, offState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();

    res.send('lights off');
  } else if (text == 'party') {

    api.setGroupLightState(lightsControlled, partyState) // provide a value of false to turn off
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
  } else if (!isNaN(intFromText)) {

    var whiteState = lightState.create().on().white(intFromText, 100);

    api.setGroupLightState(lightsControlled, whiteState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();

    res.send('set white point:' + intFromText);
  } else if (text == 'normal') {

    api.setGroupLightState(lightsControlled, normalState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();
    res.send('normal');
  } else if (text == 'pulse') {

    api.setGroupLightState(lightsControlled, pulseState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();
    res.send('pulse');
  } else if (text == 'pulses') {

    api.setGroupLightState(lightsControlled, pulsesState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();
    res.send('pulses');
  } else if (text == 'random') {

    for (var i = 0; i < 25; i++) {

      var randomColorState = lightState.create().on().rgb(getRandomArbitrary(0, 255), getRandomArbitrary(0, 255), getRandomArbitrary(0, 255));

      api.setLightState(i, randomColorState) // provide a value of false to turn off
      .then(displayResult)
        .fail(displayError)
        .done();

    }
    res.send('~*$random!@#~')
  } else if (text == 'colors') {

    for (var i = 0; i < 25; i++) {

      var randomColorState = lightState.create().on().hsl(getRandomArbitrary(0, 359), 100, 100);

      api.setLightState(i, randomColorState) // provide a value of false to turn off
      .then(displayResult)
        .fail(displayError)
        .done();

    }
    res.send('~*$random colors!@#~')
  } else if (hexFromText != undefined) {

    var color = hexToRgb(hexFromText);

    var hslColor = RGBtoHSB(color[0],color[1],color[2]);
    console.log(hslColor);  
    var namedColorState = lightState.create().on().hsl(hslColor[0],hslColor[1],90);

    api.setGroupLightState(lightsControlled, namedColorState) // provide a value of false to turn off
    .then(displayResult)
      .fail(displayError)
      .done();

    res.send('set to hex value: ' + hexFromText + 'for color: ' + text);
  } else {
    res.send('/lights commands: on, off, normal, colors, sauron, party, pulse, pulses.  Choose the side of the room: /lights colors tv, /lights colors table, /lights colors oscar');
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
