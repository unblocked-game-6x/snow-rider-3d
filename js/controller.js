'use.strict';

var controller = {

	init : function(){ // Apres le loader

		UI.endLoader(); // Suppression du loader
		
		model.connect(function(IDReturn){ // Connection au serveur

			roomID = IDReturn;
			UI.setRoomID(); // Affiche de l'id sur le site 
			console.log('Desktop connected to private room number : '+roomID);
		});

		//Initialisation des features
		model.initLocalStorage();
		controller.generateAjaxLink();
		controller.initMenu();
		controller.initIoInfo();
		controller.init_video_intro();
	},

	generateAjaxLink : function(){ // Génération des transition sur les liens
		var a = document.getElementsByClassName('nextContent');
		for (var i = 0; i < a.length; i++) {
			a[i].addEventListener('click',model.ajaxLoad,false);
			console.log(a[i]);
		};
	},

	init_video_intro : function(){ // Non MVC 
		var video_intro = document.getElementById('video_intro');
		var cache_video = document.getElementById('cacheVideo');
		var mute = document.getElementById('onOff');
		var intro = document.getElementById('textIntro');


		video_intro.addEventListener('canplaythrough',loaded,false);
		video_intro.addEventListener('timeupdate',progress,false);
		video_intro.addEventListener('ended',restart,false);
		mute.addEventListener('click',muted,false);

		video_intro.play();

		function loaded() {
			video_intro.play();
			video_intro.muted = false;
			mute.classList.add('on');
		}

		function muted() { // Muted / Unmuted
		 	if(video_intro.muted == false) {
		 		video_intro.muted = true;
		 		mute.classList.remove('on');
		 		mute.classList.add('off');
		 	}

		 	else {
		 		video_intro.muted = false;
		 		mute.classList.add('on');
		 		mute.classList.remove('off');
		 	}
		 }

		function progress() { // Apparition du "start", logo et texte
			var self = this
			var current_time = Math.round(self.currentTime*100/self.duration);


			if(current_time == 5) {
				cache_video.classList.add('cacheVideo');
				intro.style.display="block";
				intro.classList.add('textIntro');
				video_intro.removeEventListener('timeupdate',progress,false);
			}	
			
		}

		function restart(){ // Replay auto
			video_intro.play();
		}
	},
	initMenu : function(){ // Non MVC
		var menuAll = document.getElementById('menu-all');		
		var menuIcon = document.getElementById('menu-icon');
		var menuList = document.getElementsByClassName('menu-items')[0];

		menuAll.addEventListener('mouseover',function(){
			menuIcon.classList.toggle('menu-hover');
		},false);
		menuAll.addEventListener('mouseout',function(){
			menuIcon.classList.toggle('menu-hover');
		},false);

		menuAll.addEventListener('click',function(){
			menuIcon.classList.toggle('menu-on');
			menuList.classList.toggle('menu-off');
		},false);
	},
	initIoInfo : function(){ // Non MVC

		//Gestion de l'infoBox concernant la connection au serveur
		var ioConnect = document.getElementById('io-connect');
		var ioChannel = document.getElementsByClassName('io-channel')[0];
		var ioIcon = document.getElementById('io-icon');
		ioConnect.addEventListener('mouseover',function(){
			ioChannel.style.cssText='opacity:1;';
		},false);
		ioConnect.addEventListener('mouseout',function(){
			ioChannel.style.cssText='';
		},false);
		ioConnect.addEventListener('click',function(evt){
			evt.preventDefault();
			UI.toggleIoInfo();
		},false);
		ioIcon.addEventListener('click',function(evt){
			evt.preventDefault();
			UI.toggleIoInfo();
		},false);
	}


};
var socket,roomID, firstTime = true;
window.addEventListener('load',function(){ // Loader
	controller.init();
},false);
