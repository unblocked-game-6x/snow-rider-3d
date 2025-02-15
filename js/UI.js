'use.strict';

var UI = {
	endLoader : function(){ // Suppression du loader 
		var loader = document.getElementById('loader');
		loader.style.cssText='opacity:0;-webkit-transition: all 0.5s linear;-moz-transition: all 0.5s linear;-ms-transition: all 0.5s linear;-o-transition: all 0.5s linear;transition: all 0.5s linear;z-index:-999';
	},
	setRoomID : function(){ // Mise à jour de la roomID affiché sur le site 
		document.getElementsByClassName('io-channel')[0].innerHTML = roomID;
		document.getElementsByClassName('io-number')[0].innerHTML = roomID;
	},
	switchContent : function(direction){ // Switch du contenu 
		var previous = document.getElementById('activeContent');
		var now = document.getElementById('nextContent');


		if(direction == 'bottom'){ // En fonction de direction, on défini le sens du slide 
			setTimeout(function(){now.style.cssText = 'opacity:1;-webkit-transition: all 0.5s linear;-moz-transition: all 0.5s linear;-ms-transition: all 0.5s linear;-o-transition: all 0.5s linear;transition: all 0.5s linear;';},1000);
			previous.style.cssText = 'top:100%;-webkit-transition:top 1s;-moz-transition:top 1s;-ms-transition:top 1s;-o-transition:top 1s;transition:top 1s;';
		}
		else if(direction == 'top'){
			setTimeout(function(){now.style.cssText = 'opacity:1;-webkit-transition: all 0.5s linear;-moz-transition: all 0.5s linear;-ms-transition: all 0.5s linear;-o-transition: all 0.5s linear;transition: all 0.5s linear;';},1000);
			previous.style.cssText = 'top:-100%;-webkit-transition:top 1s;-moz-transition:top 1s;-ms-transition:top 1s;-o-transition:top 1s;transition:top 1s;';
		}
		else if(direction == 'left'){
			setTimeout(function(){now.style.cssText = 'opacity:1;-webkit-transition: all 0.5s linear;-moz-transition: all 0.5s linear;-ms-transition: all 0.5s linear;-o-transition: all 0.5s linear;transition: all 0.5s linear;';},1000);
			previous.style.cssText = 'left:100%;-webkit-transition:left 1s;-moz-transition:left 1s;-ms-transition:left 1s;-o-transition:left 1s;transition:left 1s;';
		}
		else if(direction == 'right'){
			setTimeout(function(){now.style.cssText = 'opacity:1;-webkit-transition: all 0.5s linear;-moz-transition: all 0.5s linear;-ms-transition: all 0.5s linear;-o-transition: all 0.5s linear;transition: all 0.5s linear;';},1000);
			previous.style.cssText = 'left:-100%;-webkit-transition:left 1s;-moz-transition:left 1s;-ms-transition:left 1s;-o-transition:left 1s;transition:left 1s;';
		}

		setTimeout(function(){
			var nextContent = document.createElement('div'); // Création du nouvel nextContent
          	nextContent.setAttribute('id','nextContent');
          	document.body.appendChild(nextContent);

          	previous.parentNode.removeChild(previous); // Supression de l'ancien activeContent
	      	
			
			var activeContent = document.createElement('div'); // Création du nouvel activeContent
			activeContent.setAttribute('id','activeContent');
			document.body.appendChild(activeContent);

			newContent = document.getElementById('allNodes'); // Déplacement des éléments 
			console.log(newContent);
			activeContent.appendChild(newContent);

			now.parentNode.removeChild(now); // Clean

		    var video = document.querySelector('video'); // Autoplay de la vidéo
    		if(video){ 
      			video.play(); 
    		}

		},1500);// Une fois que la transition s'est finie en UI
	},
	showNavBar : function(){ // Apparission de la nav bar après l'intro
		var nav = document.getElementById('menu-toggle');
		var ioInfo = document.getElementById('io-connect');
		var appear ='opacity:1;-webkit-transition: all 1.5s linear;-moz-transition: all 1.5s linear;-ms-transition: all 1.5s linear;-o-transition: all 1.5s linear;transition: all 1.5s linear;';

		nav.style.cssText = appear;
		ioInfo.style.cssText = appear;

		setTimeout(function(){
			nav.style.cssText = '';
			ioInfo.style.cssText = '';
		},1500);
	},

	afterVideo : function(){ // Apparition des liens et infos à la fin du docu
		var box = document.getElementById('after_video');
      	box.style.opacity='1';
      	box.style.zIndex='999';
	},
	replayVideo : function(){ // Masque des infos de fin du docu en cas de replay 
		var box = document.getElementById('after_video');
		box.style.opacity='0';
		box.style.zIndex='-999';
	},

	setMarkers : function(map,callback){ 

		var locations = [ // Contient l'infobulle, la position et le numéro localStorage 
		  ['inc/sk_1.html','<div class="marker-content"><strong>MegabiSkate</strong><span>Skateboarding in Addis Abeba, Ethiopie</span><em>Discover it!</em></div>', 8.9806034, 38.7577605, 1],
		  ['inc/sk_2.html','<div class="marker-content"><strong>This Ain\'t California</strong><span>Skateboarding in East Berlin (GDR), Germany</span><em>Discover it!</em></div>', 52.5200066, 13.4049540, 2],
		  ['inc/sk_3.html','<div class="marker-content"><strong>Skateboarding in India</strong><span>Skateboarding in Bangalore, India</span><em>Discover it!</em></div>', 12.9715987, 77.5945627, 3],
		  ['inc/sk_4.html','<div class="marker-content"><strong>The Modern Skate</strong><span>Skateboarding in Dordogne, France</span><em>Discover it!</em></div>', 45.1493094, 0.7606537, 4],
		  ['inc/sk_5.html','<div class="marker-content"><strong>Skateistan</strong><span>Skateboarding in Kabul, Afghanistan</span><em>Discover it!</em></div>', 34.5333330, 69.1666670, 5],
		  ['inc/sk_6.html','<div class="marker-content"><strong>I’am a Thalente</strong><span>Skateboarding in Durban, South Africa</span><em>Discover it!</em></div>', -29.8714083, 31.0304235, 6],
		  ['inc/sk_7.html','<div class="marker-content"><strong>Youth of Yangon</strong><span>Skateboarding in Yangon, Burma</span><em>Discover it!</em></div>', 16.7808330, 96.1497220, 7],
		  ['inc/sk_8.html','<div class="marker-content"><strong>Cuba Skate</strong><span>Skateboarding in Havana, Cuba</span><em>Discover it!</em></div>', 23.0511477, -82.3367776, 8]
		];

		var logoImage = { 
  			url : "img/logo_v1.png",
  			scaledSize: new google.maps.Size(100, 100)
		}

		var logoMarker = new google.maps.Marker({ // Mise en place du logo dans l'océan Atlantique 
        	position: new google.maps.LatLng(40, -30),
        	map: map,
        	clickable: false,
        	icon: logoImage
    	});

    	var markerRed = { // Marker contenu déjà vu
      		url :'./img/marker_red.png',
      		scaledSize: new google.maps.Size(35, 35)
    	}	

	    var markerGrey = { // Marker contenu pas encore vu
	      url:'./img/marker_grey.png',
	      scaledSize: new google.maps.Size(35, 35)
	    }

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < locations.length; i++) {
		  	if(localStorage.getItem(locations[i][4])=="yes"){ // Si le contenu est déjà vu ...
					marker = new google.maps.Marker({
			    	position: new google.maps.LatLng(locations[i][2], locations[i][3]),
			    	map: map,
			    	icon: markerRed, // ... marker rouge 
			  	});
			}
			else{
				marker = new google.maps.Marker({
			    	position: new google.maps.LatLng(locations[i][2], locations[i][3]),
			    	map: map,
			    	icon: markerGrey, // ... sinon marker gris 
			  	});				
			}

		  google.maps.event.addListener(marker, 'mouseover', (function(marker, i) { // Ajout des infobulles 
		    return function() {
		      infowindow.setContent(locations[i][1]);
		      infowindow.open(map, marker);
		    }
		  })(marker, i));

		  callback.call(this,marker,locations[i][0]); // Quand l'infobulle et son Marker sont crées je les retourne un à un pour les associer au l'event click
		};
	},
  	toggleIoInfo : function(){ // Toggle de l'info box socket.io
    	var ioInfoBox = document.getElementById('io-info');
   	 	if(ioInfoBox.style.opacity == 0){
      		ioInfoBox.style.opacity='1';
      		ioInfoBox.style.zIndex='999';
    	}
    	else{
      		ioInfoBox.style.opacity='0';
      		ioInfoBox.style.zIndex='-999';      
    	}
  	},
  	bounce : function(){ // Ajoute la classe bounce au passage d'un point à envoyer au cour de la lecture du docu
  		var icon = document.querySelector('.io-img');
  		icon.classList.add('bounce');
  		setTimeout(function(){
  			icon.classList.remove('bounce');
  		},1000);
  	}
};











