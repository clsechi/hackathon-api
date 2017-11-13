var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var watsonAuth = require('./../config/watson-speech-to-text.js');

var speech_to_text = new SpeechToTextV1(watsonAuth);

var finalPhrase = {};

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
		setServicos(event, res);
	});

}

function setServicos(phraseWatson, res) {

	var phrase = phraseWatson.results[0].alternatives[0].transcript;

	asyncCreateJSON(phrase).then(function () {
		//salva as frases do watson e finais no banco
		savePhrases(phrase);
		//envia resposta para o cliente
		res.json(finalPhrase);
	});
}

function savePhrases(phrase) {
	console.log("Watson " + phrase);
	console.log("********************");
	console.log("Identificado " + finalPhrase);
}

async function asyncCreateJSON(phrase) {
	
	finalPhrase = {
		tipo: "Não identificado",
		onde: "Não identificado",
		local: "Não identificado",
		medida: "Não identificado",
		quando: "Não identificado",
	}	

	//TO DO implement Promisse.all([])
	await setTipoServico(phrase);
	await setLocalServico(phrase);
	await setOndeServico(phrase);
	await setMedidaServico(phrase);
	await setQuandoServico(phrase);
}



function setTipoServico(phrase) {

	words = ["construção","reforma","instalação","troca"];
	replyWords = ["Construção","Reforma","Instalação","Troca"];

	for (var i = 0; i < words.length; i++) {
		if(phrase.includes(words[i])){
			finalPhrase.tipo = replyWords[i];
			return;
		}
	}
}

function setOndeServico(phrase) {
	
	words = [
				["construção em geral","obra"],
				["forro","teto"],
				["parede","estrutura"],
				["piso","revestimento"],
				["porta","janela"],
				["telhado","telhas"]
			];

	replyWords = [	"Construção em geral",
					"Forro",
					"Paredes e estruturas",
					"Pisos e revestimentos", 
					"Portas e janelas", 
					"Telhados e telhas"];

	for (var i = 0; i < words.length; i++) {
		for (var j = 0; j < words[i].length; j++) {	
			if(phrase.includes(words[i][j])){
				finalPhrase.onde = replyWords[i];
				return;
			}
		}
	}
}

function setLocalServico(phrase) {
	
	words = ["casa","apartamento","comercial","terreno"];
	replyWords = ["Casa","Apartamento","Comercial","Lote de Terreno"];

	for (var i = 0; i < words.length; i++) {
		if(phrase.includes(words[i])){
			finalPhrase.local = replyWords[i];
			return;
		}
	}

}

function setMedidaServico(phrase) {
	
	words = [
				["cinquenta metros quadrados", "pequeno"],
				["sessenta metros quadrados", "cento e cinquenta metros quadrados", "médio"],
				["cento e sessenta metros quadrados", "grande"],
				["não possuo", "não tenho", "não sei"]
			];

	replyWords = ["Pequeno (até 50m²)","Médio (de 50 a 150 m²)","Grande (mais de 150 m²)","Não Tenho"];

	for (var i = 0; i < words.length; i++) {
		for (var j = 0; j < words[i].length; j++) {	
			if(phrase.includes(words[i][j])){
				finalPhrase.medida = replyWords[i];
				return;
			}
		}
	}
}

function setQuandoServico(phrase) {
	
	words = [
				["quanto antes", "rápido", "ontem", "agora"],
				["próximos trinta dias", "próximos vinte dias", "próximos dez dias"],
				["proximos três meses", "proximos dois meses"],
				["não tenho certeza", "não sei"]
			];

	replyWords = ["O quanto antes possível","Nos próximos 30 dias","Nos próximos 3 meses","Não tenho certeza"];

	for (var i = 0; i < words.length; i++) {
		if(phrase.includes(words[i])){
			finalPhrase.quando = replyWords[i];
			return;
		}		
	}
}

module.exports = function () {
	return SpeechToText;
}