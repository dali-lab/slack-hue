import express from 'express';
import logfmt from 'logfmt';
import bodyParser from 'body-parser';
import hue from 'node-hue-api';
import tinycolor from 'tinycolor2';


const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));
app.use(logfmt.requestLogger());


const HueApi = hue.HueApi;
const lightState = hue.lightState;

const nametoHex = require('colornames');

const displayResult = (result) => {
  console.log(JSON.stringify(result, null, 2));
};

const displayError = (err) => {
  console.log(err);
};

const hostname = '129.170.212.42';
const username = 'ececaeb13474f4f324487f375198d7';
const api = new HueApi(hostname, username);

// group ids
const oscarLights = 2;
const centerLights = 3;
const tvLights = 4;
const locations = ['oscar', 'center', 'tv'];


function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * ((max - min) + min));
}


const normalState = lightState.create().on().white(325, 100);
const onState = lightState.create().on();
const offState = lightState.create().off();
const partyState = lightState.create().on().colorLoop();
const dimmestState = lightState.create().bri(50);
const dimState = lightState.create().bri(100);
const shadyState = lightState.create().bri(150);
const brightState = lightState.create().bri(200);
const brightestState = lightState.create().bri(250);

const flashState = lightState.create().alertShort();
const pulsesState = lightState.create().alertLong();

const states = ['normal', 'on', 'off', 'party', 'dimmest', 'dim', 'shady',
'bright', 'brightest', 'flash', 'pulses'];


app.post('/', (req, res) => {
  console.log(`body: ${req.body}`);
  console.log(`text :${req.body.text}`);


  const texts = req.body.text.split(' ');

  console.log(`LENGTH: ${texts.length}`);

  // defines color
  const text = texts[0];
  const hexFromText = nametoHex(text);
  console.log(`COLOR:${text}`);
  // defines lights controlled
  const text2 = texts[1];
  console.log(`text2:${text2}`);
  let lightsControlled;
  switch (text2) {
    case 'oscar':
      lightsControlled = oscarLights;
      break;
    case 'tv':
      lightsControlled = tvLights;
      break;
    case 'table':
      lightsControlled = centerLights;
      break;
    default:
      lightsControlled = 0;
      break;

  }

  const intFromText = parseInt(text, 10);


  // if (text === 'on') {
  //   api.setGroupLightState(lightsControlled, onState)
  //     .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //
  //   res.send('lights on');
  // } else if (text === 'tv') {
  //   res.send('tv');
  // } else if (text === 'off') {
  //   api.setGroupLightState(lightsControlled, offState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('lights off');
  // } else if (text === 'party') {
  //   api.setGroupLightState(lightsControlled, partyState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('party!');
  // } else if (text === 'dim') {
  //   api.setGroupLightState(lightsControlled, dimState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('dim ;)');
  // } else if (text === 'dimmest') {
  //   api.setGroupLightState(lightsControlled, dimmestState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('dimmed ;)');
  // } else if (text === 'shady') {
  //   api.setGroupLightState(lightsControlled, shadyState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('shady');
  // } else if (text === 'bright') {
  //   api.setGroupLightState(lightsControlled, brightState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('bightened');
  // } else if (text === 'brightest') {
  //   api.setGroupLightState(lightsControlled, brightestState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('bightened!!');
  // } else if (!isNaN(intFromText)) {
  //   const whiteState = lightState.create().on().white(intFromText, 100);
  //
  //   api.setGroupLightState(lightsControlled, whiteState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send(`white point set (154 - 500): ${intFromText}`);
  // } else if (text === 'normal') {
  //   api.setGroupLightState(lightsControlled, normalState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('normal');
  // } else if (text === 'flash') {
  //   api.setGroupLightState(lightsControlled, flashState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('pulse');
  // } else if (text === 'pulses') {
  //   api.setGroupLightState(lightsControlled, pulsesState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //   res.send('pulses');
  // } else if (text === 'random') {
  //   for (let i = 0; i < 25; i++) {
  //     const randomColorState = lightState.create().on().rgb(getRandomArbitrary(0, 255), getRandomArbitrary(0, 255), getRandomArbitrary(0, 255));
  //
  //     api.setLightState(i, randomColorState) // provide a value of false to turn off
  //     .then(displayResult)
  //       .fail(displayError)
  //       .done();
  //   }
  //   res.send('~*$random!@#~');
  // } else if (text === 'colors') {
  //   for (let i = 0; i < 25; i++) {
  //     const randomColorState = lightState.create().on().hsl(getRandomArbitrary(0, 359), 100, 100);
  //
  //     api.setLightState(i, randomColorState) // provide a value of false to turn off
  //     .then(displayResult)
  //       .fail(displayError)
  //       .done();
  //   }
  //   res.send('~*$random colors!@#~');
  // } else if (hexFromText !== undefined) {
  //   const color = tinycolor(hexFromText);
  //
  //   const hslColor = color.toHSL();
  //   console.log(hslColor);
  //   const namedColorState = lightState.create().on().hsl(hslColor.h, hslColor.s, 90);
  //
  //   api.setGroupLightState(lightsControlled, namedColorState) // provide a value of false to turn off
  //   .then(displayResult)
  //     .fail(displayError)
  //     .done();
  //
  //   res.send(`set to hex value: ${hexFromText}for color: ${text}`);
  // } else {
 // help

  res.send(`/lights [command] [location (optional)]:\nCommands: ${states.join(', ')}\nLocations: ${locations.join(', ')}`);
  // }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
