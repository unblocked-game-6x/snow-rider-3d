'use.strict';

var model = {

	connect : function(callback){ // Connection à socket.io
		this.socket = io.connect('http://37.187.116.10:3000');
	},	
	IDSubmit : function(callback){ // Envoi de l'ID saisi
		var roomID = document.getElementById('roomID').value;
		model.socket.emit('mobile connection',roomID);

		model.socket.on('wrong roomID',function(){ // Retour négatif : erreur d'ID
			callback.call(this,false);
		});
		model.socket.on('room join',function(){ // Retour positif : le téléphone join la room 
			callback.call(this,true);
		});

	},
	newEvent : function(callback){
		model.socket.on('desktop event',function(data){ // Un évènement arrive dans la room
			callback.call(this,data);
		});
	},

	maxLengthCheck : function(object) { // On s'assure que l'user entre uniquement 4 chiffres 
		if (object.value.length > object.maxLength) {
			object.value = object.value.slice(0, object.maxLength);
		}
	}	
};
