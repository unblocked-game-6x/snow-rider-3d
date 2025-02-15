'use.strict';

var server = {

	init : function(){ // Création du server 

		this.io = require('socket.io').listen(3000);
		console.log('Server listen on *: 3000');
		this.io.on('connection',this.listen);

		this.roomList = new Array(); // Répertoire des rooms crées 

	},

	listen : function(socket){

		socket.on('desktop connection',function(){ // Lorsqu'un desktop se connect 
			var roomID = 0000, 
				unique = true;

			do{ // Generation d'un roomID unique 
				roomID = Math.round(Math.random()*999) + Math.round((Math.random()*8)+1)*1000; // Assure le format 4 chiffres 
				for (var i = 0; i < server.roomList.length; i++){
					if(server.roomList[i] == roomID){ // Si le room ID existe déjà, on le regénère 
						unique = false;
					} 
				};
			}while(!unique);
			server.roomList.push(roomID); // On ajoute la nouvelle room dans notre répertoire 
			socket.roomID = roomID; // On sauvegarde le roomID dans l'objet socket 
			socket.join(roomID+''); // On join la room
			console.log('New room ID : '+roomID);
			socket.emit('room join',roomID); // Envoi du roomID vers le pc
		});

		socket.on('mobile connection',function(roomID){ // Lorsq'un mobile se connecte 
			console.log('Try to connect a mobile to : '+roomID);
			var idOK = false;
			for (var i = 0; i < server.roomList.length && idOK == false; i++) { // On regarde si la room existe 
				if(server.roomList[i] == roomID){ // la room existe 
					socket.join(roomID+''); // join d'un nouveau mobile 
					socket.emit('room join'); // Le mobile va commencer à écouter les events
					idOK = true; // Pour sortir du for 
					console.log('... SUCCESFULL !!');
				}
			};
			if(idOK==false){ // Tout le répertoire a été parcouru et aucune room n'a se numéro, elle n'existe pas 
				socket.emit('wrong roomID'); // Retourne l'erreur au mobile 
				console.log('... ERROR !!');
			}
		});

		socket.on('desktop event',function(data){ // Lorsqu'un pc envoi un évènement de documentaire 
			server.io.to(socket.roomID).emit('desktop event',data); // On le transmet à tout les mobiles connectés à sa room
		});

		socket.on('disconnect',function(){

		});
	}
};
server.init(); // Initialisation du serveur