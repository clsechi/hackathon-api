module.exports = function(app){

	app.get('/', function(req, res){
		res.send('ok.');
	});

	app.post('/upload/audio', function(req, res){

		var speechToText = new app.controllers.speechToText();

		speechToText.convert(req, res);
	});

	app.get('/admin', function (req, res) {
		
		res.render('admin');
	})
}