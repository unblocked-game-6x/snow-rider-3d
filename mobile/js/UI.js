'use.strict';

var UI = {

	IDError : function(){ // Affichage de l'erreur 
		var roomInfo = document.getElementById('content');
		roomInfo.innerHTML = 'Wrong ID :(';
		roomInfo.style.cssText='opacity:1';

		UI.navVibration(500);
	},
	connectionOk : function(){ // On masque le formulaire et on affiche un message 
		var connectBox = document.getElementById('connect');
		connectBox.style.cssText='opacity:0;z-index:-999;position:absolute;';
		var content = document.getElementById('content');
		content.innerHTML = 'Play a video to get exclussive content';
		content.style.cssText='opacity:1';
		UI.navVibration(500);
	},
	renderEvent : function(data){ // Affichage de l'information envoyé par le desktop
		console.log(data);
		document.getElementById('content').innerHTML = data;
		UI.navVibration(500);
	},
	navVibration : function(time){ // Vibre si le mobile est compatible et l'y autorise 
		if(window.navigator.vibrate){
			navigator.vibrate(time);
		}
	}
};