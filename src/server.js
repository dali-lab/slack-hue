import express from 'express';
import logfmt from 'logfmt';
import bodyParser from 'body-parser';
import hue from 'node-hue-api';
import tinycolor from 'tinycolor2';
import colornames from 'colornames';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));
app.use(logfmt.requestLogger());


const hostnames = process.env.HOSTNAMES.split(',');
const usernames = process.env.USERNAMES.split(',');

const apis = hostnames.map((host, i) => { return new hue.HueApi(hostnames[i], usernames[i]); });
const lightState = hue.lightState;

const displayResult = (result) => {
  console.log(JSON.stringify(result, null, 2));
};

const displayError = (err) => {
  console.log(err);
};


// api.config().then(displayResult).done();
// api.fullState().then(displayResult).done();

const config = {};

const fetchLightGroups = (api) => {
  return api.scenes().then((res) => {
    return res.slice(1)
    .map((g) => { return { name: g.name.toLowerCase(), id: g.id, owner: g.owner, lights: g.lights.sort().join() }; });
  }).then((scenes) => {
    return api.groups().then((res) => {
      res.slice(1).forEach((g) => {
        config[g.name] = { api, id: g.id, lights: g.lights.sort().join(), owner: g.owner };
        const matches = scenes.filter((a) => { return a.lights === g.lights.sort().join(); });
        config[g.name].scenes = matches.map((x) => { return { name: x.name.toLowerCase(), id: x.id, owner: x.owner }; });
      });
    });
  });
};

// get configs for all the apis (every hue controller)
apis.forEach((api) => { fetchLightGroups(api); });

const extraStates = {
  party: lightState.create().on().colorLoop(),
  flash: lightState.create().alertShort(),
  pulse: lightState.create().alertLong(),
  off: lightState.create().turnOff(),
  on: lightState.create().turnOn(),
};


// handle posts in the format of: location scene.   set up as outgoing webhook in slack
app.post('/', (req, res) => {
  const message = req.body.text.split(' ');

  const location = message[0];
  console.log(`location: ${location}`);

  const scene = message.slice(1).join(' ');
  console.log(`scene: ${scene}`);

  const hex = colornames(scene);
  console.log(`hex: ${hex}`);

  // check if scene to active is a possible option
  const sceneToActivate = (location in config) ? config[location].scenes.filter((s) => { return s.name === scene; })[0] : null;

  // find intersection in all the scenes for global changes
  const sceneIntersection = _.intersection(...Object.values(config).map((x) => { return x.scenes.map((y) => { return y.name; }); }));

  const inIntersection = sceneIntersection.find((x) => { return x === scene; });
  const inExtras = (scene in extraStates);

  const simpleconfig = {}; // for print
  Object.entries(config).forEach(([k, v]) => { simpleconfig[`*${k}*`] = _.sortedUniq(v.scenes.map((s) => { return `_${s.name.toLowerCase()}_`; }).sort()); });
  simpleconfig['*all*'] = Object.keys(extraStates).concat(sceneIntersection);


  if (location === 'all' && (inExtras || inIntersection)) {
    console.log('lets do it all');
    const todo = [];
    // wrap a loop of api calls to be executed later
    // either for specific scenes or extra commands
    const wrap = (loc, sceneid) => {
      if (inExtras) {
        return new Promise((resolve, reject) => {
          loc.api.setGroupLightState(loc.id, extraStates[scene])
            .then((res) => { return resolve(res); })
            .catch((err) => { return reject(err); });
        });
      } else {
        return new Promise((resolve, reject) => {
          loc.api.activateScene(sceneid)
            .then((res) => { return resolve(res); })
            .catch((err) => { return reject(err); });
        });
      }
    };
    // find each individual scene in each location and construct a bunch of promises for it.
    Object.values(config).forEach((loc) => {
      const newscene = loc.scenes.find((x) => { return x.name === scene; });
      const sceneid = (newscene && 'id' in newscene) ? newscene.id : null;
      todo.push(wrap(loc, sceneid));
    });
    Promise.all(todo).then(() => {
      res.send('Can do!');
    }).catch((error) => {
      res.send(`error: ${error}`);
    });
  } else if (location in config && sceneToActivate) {
    console.log(`location ${location} and scene ${sceneToActivate.name} verified`);
    config[location].api.activateScene(sceneToActivate.id)
      .then(displayResult)
      .fail(displayError)
      .done(res.send('Can do!'));
  } else if (location && scene in extraStates) {
    config[location].api.setGroupLightState(config[location].id, extraStates[scene])
      .then(displayResult)
      .fail(displayError)
      .done(res.send('Can do!'));
  } else if (location && hex) {
    // if there is a converted hex color then add some saturation and set that color
    const color = tinycolor(hex).saturate(98);
    const hslColor = color.toHsl();
    const namedColorState = lightState.create().on().hsl(hslColor.h, hslColor.s * 100, hslColor.l * 100);
    config[location].api.setGroupLightState(config[location].id, namedColorState)
      .then(displayResult)
      .fail(displayError)
      .done(res.send('Can do!'));
  } else {
    console.log('unknown location or scene');
    res.send(`/lights [location] [scene||colorname||party]\n${JSON.stringify(simpleconfig).replace(/"|{|}/g, '').replace(/],/g, ']\n')}`);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
