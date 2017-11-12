var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var watsonAuth = require('./../config/watson-speech-to-text.js');

var speech_to_text = new SpeechToTextV1(watsonAuth);

function SpeechToText() {
	//watson params
	this._params = {
		model: 'pt-BR_BroadbandModel',
		content_type: 'audio/mp3',
		'interim_results': false, //retorna somente a frase final
		'max_alternatives': 1,
		'word_confidence': false,
		timestamps: false,
	};
}

SpeechToText.prototype.convert = function (req, res) {
	
	// Create the stream.
	var recognizeStream = speech_to_text.createRecognizeStream(this._params);

	req.pipe(recognizeStream);

	recognizeStream.on('results', function(event) { 
		onEvent('Results:', event);
		res.sendStatus(200);
	});

}

// Displays events on the console.
function onEvent(name, event) {
	//console.log(name, JSON.stringify(event, null, 2));
	var phrase = event;
	console.log(phrase.results[0].alternatives[0].transcript);
	console.log(phrase.results[0].alternatives[0]);
}

module.exports = function () {
	return SpeechToText;
}