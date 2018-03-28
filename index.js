var express = require('express'),
    path = require('path'),
    app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static('public'));

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port')); }
});

var TextToSVG = require('text-to-svg');
var textToSVG = TextToSVG.loadSync();
 
var attributes = {fill: 'red', stroke: 'black'};
var options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
 
var svg = textToSVG.getSVG('hello', options);
 
console.log(svg);