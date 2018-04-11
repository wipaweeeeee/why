const express = require('express'),
	  path = require('path'),
      app = express();

app.set('view engine', 'ejs')

app.set('port', (process.env.PORT || 8080));

//app.use(express.static('public'));

var TextToSVG = require('text-to-svg');
var textToSVG = TextToSVG.loadSync();
 
var attributes = {id: 'h'};
var options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
 
var svg = textToSVG.getSVG('h', options);
 
console.log(svg);

app.get('/', function(req,res) {
	
	//res.sendFile(path.join(__dirname+'/index.html'));
	res.render('index', {svg: svg});
})

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port')); }
});

