// Nook Harquail
//

var express = require("express");
var logfmt = require("logfmt");
var app = express();
var sleep = require('sleep');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies
var http = require('http'); //the variable doesn't necessarily have to be named http
app.use(logfmt.requestLogger());

//the number of hue lights
var NUM_LIGHTS = 15;

//the ip address of the hue basestation.  dalights.cs.dartmouth.edu
var options = {
host: '129.170.212.42',
port: 80,
path: '/api/newdeveloper/groups/0/action',
method: 'PUT'
};

var shouldTV = false;

//range of lights near oscar
var oscarLights = [10,12,13,15,3,1];
//range of lights near tv
var tvLights = [9,11,6,5,4,2,0,7,8];
//range of lights in center
var centerLights = [14];


var onData = {
on: true,
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

var veryBrightData = {
on: true,
bri: 255,
};

var brightData = {
on: true,
bri: 230,
};
var mediumBrightData = {
on: true,
bri: 200,
    
};

var lessDimData = {
on: true,
bri: 155,
    
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
alert: 'select'
};

var pulseManyData = {
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
         
         console.log('body: '+req.body);
         console.log('text :'+req.body.text);
         
         
         var texts = req.body.text.split(" ");
         
         console.log("LENGTH: "+ texts.length);
         
         //defines color
         var text = texts[0];
         console.log("COLOR:"+ text);
         //defines lights controlled
         var text2 = texts[1];
         console.log("text2:"+ text2);
         var lightsControlled;
         switch(text2){
         case "oscar": lightsControlled = oscarLights;   break;
         case "tv": lightsControlled = tvLights; break;
         case "table": lightsControlled = centerLights; break;
         default: lightsControlled = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
         break;
         
         }
         
         
         if (text != 'tv'){
         shouldTV = false;
         }
         
         if( text =='on') {
         res.send('lights on');

         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(onData,lightsControlled[i]);
         }
         
         }
         else if (text == 'tv'){
         shouldTV = true;
         res.send('tv');
         }
         else if (text == 'off'){
         for(var i =0; i<lightsControlled.length; i++){
                    sleep.usleep(i*1000);
                    lightWithDataAndNumber(offData,lightsControlled[i]);
         }
         res.send('lights off');
         }
         else if (text == 'party'){
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(partyData,lightsControlled[i]);
         }
         res.send('party!');
         }
         else if (text == 'dim'){
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(lessDimData,lightsControlled[i]);
         }
         res.send('dimmed');
         }
         else if (text == 'very dim'){
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(dimData,lightsControlled[i]);
         }
         res.send('dimmed ;)');
         }
         else if (text == 'shady'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(mediumBrightData,lightsControlled[i]);
         }
         res.send('shady');
         }
         else if (text == 'bright'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(brightData,lightsControlled[i]);
         }
         res.send('bightened');
         }
         else if (text == 'very bright'){
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         lightWithDataAndNumber(veryBrightData,lightsControlled[i]);
         }
         res.send('bightened!!');
         }
         else if (text == 'sauron'){
         console.log("SAURON");
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(redData,lightsControlled[i]);
         }
         res.send('sauron');
         }
         else if (text == 'blue'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(blueData,lightsControlled[i]);
         }
         
         res.send('blue');
         }
         else if (text == 'orange'){
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(orangeData,lightsControlled[i]);
         }
         res.send('orange');
         }
         else if (text == 'green'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(greenData,lightsControlled[i]);
         }
         res.send('green');
         
         }
         else if (text == 'normal'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);

//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(normalData,lightsControlled[i]);
         }
         res.send('normal');
         }
         else if (text == 'purple'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
//         console.log("\n\nTHIS IS I:\n"+lightsControlled[i]);
         lightWithDataAndNumber(purpleData,lightsControlled[i]);
         }
         res.send('purple');
         }
         else if (text == 'pulse'){
         
         lightsWithData(pulseData);
         res.send('pulse');
         }
         else if (text == 'pulses'){
         
         lightsWithData(pulseManyData);
         
         res.send('pulses');
         }
         else if (text == 'sparkle'){
         
         for(i in lightsControlled){
         lightWithDataAndNumber(pulseManyData,i);
         }
         res.send('sparkle');
         }
         else if (text == 'random'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.usleep(i*1000);
         var tempData = {
         on: true,
         hue: getRandomArbitrary(0,65535),
         sat: getRandomArbitrary(130,255)
         };
         console.log(tempData);
         lightWithDataAndNumber(tempData, lightsControlled[i]);
         }
         res.send('~*$random!@#~')
         }
         else if (text == 'colors'){
         
         for(var i =0; i<lightsControlled.length; i++){
         sleep.sleep(i*10000);
         var tempData = {
         on: true,
         hue: getRandomArbitrary(0,65535),
         sat: getRandomArbitrary(220,255)
         };
         console.log(tempData);
         lightWithDataAndNumber(tempData, lightsControlled[i]);
         }
         res.send('~*$random colors!@#~')
         }
         else{
         res.send('/lights commands: on, off, random, very dim, dim, shady, bright, very bright, blue, green, orange, purple, normal, colors, sauron, party, pulse, pulses tv');
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
