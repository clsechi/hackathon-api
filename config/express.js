var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser')
var watson = require('watson-developer-cloud');

module.exports = function(){
    var app = express();

   	app.use(express.static('./public'));

    app.set('view engine', 'ejs');
	app.set('views', './views');
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    consign()
    	.include('./controllers')
    	.into(app);

    return app;
}