'use.strict';

var model = {

	connect : function(callback){
		socket = io.connect('http://37.187.116.10:3000'); // Connection à socket.io

		socket.emit('desktop connection'); // Un desktop se connecte 

		socket.on('room join',function(IDReturn){
			callback.call(this,IDReturn); // La connection a réussi et a retourné un numéro de room privé 
		});

	},

  ajaxLoad : function(e){

    UI.showNavBar();
    e.preventDefault();

    var video = document.querySelector('video'); // On met en pause les vidéos en cour de lecture avant de les supprimer, évite des erreurs diverses
    if(video){ 
      video.pause(); 
    }
    var href = this.href;
    var splited = href.split('/');
    splited = splited[splited.length-1]; // On récupère la cible du lien 
    var direction = this.getAttribute('data-direction'); // On récupère la direction du switch
    if(splited == 'after_intro'){ // La page après l'intro
      model.importAfterIntro(function(){
        UI.switchContent(direction);
        if(firstTime){ // Si c'est la première fois, j'affiche l'infobox socket io 
          setTimeout(function(){
            UI.toggleIoInfo();
          },1000);
          firstTime=false;// La prochaine fois je ne l'affiche pas
        }
      });
    }
    else if(splited == 'the_map'){ // Roadmap
      model.importTheMap(function(){
        UI.switchContent(direction);
      });
    }
    else if(splited == 'support'){ // Support
      model.importSupport(function(){
        UI.switchContent(direction);
      });
    }
    else{ // Docu
      model.importContent(href,function(){
        model.setViewed(href);
        UI.switchContent(direction);
      });
    }
  },
  importSupport : function(callback){ // Import de la page support 
    var xmlhttp = new XMLHttpRequest();

    var container = document.createElement('div');
    container.setAttribute('id','allNodes'); // Création du nouveau container 
    document.getElementById('nextContent').appendChild(container);
      xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
          { 
            document.getElementById("allNodes").innerHTML = xmlhttp.responseText;
          }
      }
    
    xmlhttp.open("GET",'inc/support.html',true);
    xmlhttp.send();

    callback.call(this);

  },
	importContent : function(href,callback){ // Import d'un docu
		var xmlhttp = new XMLHttpRequest();

    var container = document.createElement('div');
    container.setAttribute('id','allNodes');
    document.getElementById('nextContent').appendChild(container); // Création du nouveau container 
  		xmlhttp.onreadystatechange=function(){
	  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    	  { 
            document.getElementById("allNodes").innerHTML = xmlhttp.responseText;
            model.docuPlayer(); // Gestion de la docu affiché 
            var nextPrev = document.querySelectorAll('#after_video a.nextContent'); // Gestion des liens de fin de docu
            for (var i = 0; i < nextPrev.length; i++) {
              nextPrev[i].addEventListener('click',model.ajaxLoad,false);
            };
          }
    	}
  	
		xmlhttp.open("GET",href,true);
		xmlhttp.send();

    callback.call(this);
	},

	importTheMap : function(callback){ // Import de la map
    var xmlhttp = new XMLHttpRequest();

		var mapOptions = { // Set des options de la maps 
      zoom: 3,
      zoomControl: false,
      maxZoom : 4,
      minZoom : 2,
      mapTypeControl: false,
      streetViewControl : false,
      panControl: false,
      center: new google.maps.LatLng(24.071876, 15.441456) // Position initiale
    };
    var container = document.createElement('div');
    var legend = document.createElement('div');
    legend.classList.add('map-legend'); // Création de la box legend en dur car ici on ne charge pas un map.html, on créer la map avec l'api
    legend.innerHTML = '<div><img src="img/marker_grey.png"><span>To discover</span></div><div><img src="img/marker_red.png"><span>Already seen</span></div>';
    container.setAttribute('id','allNodes');
    document.getElementById('nextContent').appendChild(container); // Création du nouveau container

    var map = new google.maps.Map(container,mapOptions);
    container.appendChild(legend);

    UI.setMarkers(map,function(marker,href){ // On set les markers sur la map
      google.maps.event.addListener(marker, 'click', function() {
           model.importContent(href,function(){ // Gestion du clique sur markers
              model.setViewed(href);
              UI.switchContent('bottom');
           });
      });
    });

    xmlhttp.onreadystatechange=function(){ // Chargement du fichier map_settings.json
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        { 
          var mapStyle =  xmlhttp.response; 
          map.setOptions({styles: mapStyle}); 
        }
    }
    xmlhttp.open("GET",'js/map_settings.json',true); // Contient le style de la map
    xmlhttp.responseType = 'json'; // En JSON :)
    xmlhttp.send();

    callback.call(this);
	},

	importAfterIntro : function(callback){ // Import de la page "d'apres l'intro"
		
    // Generation de deux random number
		var left  = Math.round((Math.random()*3)+1), 
			right;
		do{
			right = Math.round((Math.random()*3)+1);
		}while(left == right); 

    var nextContent = document.getElementById('nextContent'); // Selection et création des nouveaux conteneurs
    var div = document.createElement('div');
    div.setAttribute('id','allNodes');
    nextContent.appendChild(div);

    var container = document.createElement('div');
    container.setAttribute('id','left');
    div.appendChild(container);

    container = document.createElement('div');
    container.setAttribute('id','right');
    div.appendChild(container);

		var xmlhttp_left = new XMLHttpRequest();
    var xmlhttp_right = new XMLHttpRequest();

  		xmlhttp_left.onreadystatechange=function(){ 
	  		if(xmlhttp_left.readyState==4 && xmlhttp_left.status==200){
          document.getElementById("left").innerHTML = xmlhttp_left.responseText;
          allEvent(); // PLacé ici car requêtes asynchrones
        }
    	}
      xmlhttp_right.onreadystatechange=function(){
        if(xmlhttp_right.readyState==4 && xmlhttp_right.status==200){
          document.getElementById("right").innerHTML = xmlhttp_right.responseText;
          allEvent(); // PLacé en double car requêtes asynchrones
        }
      }
  	
    //Double appel ajax pour les deux skateurs
		xmlhttp_left.open("GET",'inc/left/sk_'+left+'.html',true);
		xmlhttp_left.send();
		xmlhttp_right.open("GET",'inc/right/sk_'+right+'.html',true);
		xmlhttp_right.send();

    function allEvent(){ // Ajout des événements sur les nouveau élements 
      var a = document.querySelectorAll('.bg-choice a');
      var choice = document.querySelectorAll('.bg-choice');

      for (var i = 0; i < choice.length; i++) {
        choice[i].addEventListener('mouseover',bgChoiceMouseover,false);
        choice[i].addEventListener('mouseleave',bgChoiceMouseleave,false);
        a[i].addEventListener('click',model.ajaxLoad,false);
      };
      function bgChoiceMouseover(){
        this.classList.add('zoom-bg');
      }
      function bgChoiceMouseleave(){
        this.classList.remove('zoom-bg');
      }
    }
		callback.call(this);

	},

  docuPlayer : function(){
    var video = document.getElementById('videoSkater');
    var progress_bar = document.getElementById('progressBar');
    var current_time = document.getElementById('current');
    var total_time = document.getElementById('total');
    var play = document.getElementById('playPause');
    var playerMute = document.getElementById('playerOnOff');
    var playerReplay = document.querySelector('.playerReplay');

    playerReplay.addEventListener('click',function(event){ // Gestion du bouton replay en fin de vidéo
      event.preventDefault();
      video.play();
      UI.replayVideo();
    },false);

    // On écoute l'évènement de playPause et de Mute.
    playerMute.addEventListener('click',playerMuted,false);
    play.addEventListener('click',playPause,false);

    // On initialise theLast à 0.
    var theLast = 0;
    video.addEventListener('timeupdate',function(){
      playprogress(this);
    },false);
    progress_bar.addEventListener('click',setVideoTime,false);

    video.addEventListener('ended',UI.afterVideo,false);

    video.play();

    function playprogress(self) {
      UI.replayVideo();

      // Evolution de la progress bar.
      var progress=self.currentTime*100/self.duration;
      document.querySelector('.progress').style.width=progress+'%';

      // Transformation du format secondes en minutes : secondes
      var minutes = Math.floor(video.duration/60);
      var sec = Math.round(video.duration - (minutes * 60));
      if(sec<10){sec = '0'+sec;}
      total_time.innerHTML = minutes+':'+sec;

      minutes = Math.floor(video.currentTime/60);
      sec = Math.round(video.currentTime - (minutes * 60));
      if(sec<10){sec = '0'+sec;}
      current_time.innerHTML = minutes+':'+sec;

      // Arrondi du moment X de la vidéo
      var current = Math.round(video.currentTime);

      // récupération des span contenant le data-time, visible dans la progress bar.
      var data = document.querySelectorAll('#dot span'); 

      // Parcours de toute les span
      for(var i = 0; i < data.length; i++) {
        // Récupération de l'attribut data-time.
        var data_time = data[i].getAttribute('data-time');

        // Ajout et placement des losanges en fonction du data-time indiqué.
        var dot = Math.round(data_time*100/self.duration);
        data[i].classList.add('positionAction');
        data[i].style.left=dot+'%';

        // Stop la propagation pour empêcher de revenir au début de la vidéo au clic sur un dot.
        data[i].addEventListener('click',function(e) {
          e.stopPropagation();
        },false);

        // Si le temps de la video est égale au data-time..
        if(data_time == current && theLast != dot) {

          console.log(dot+' '+theLast);
          theLast = dot;
          // on push l'élement sur le mobile.
          socket.emit('desktop event',data[i].innerHTML);
          UI.bounce();
        }
      }
    }

    function setVideoTime(e) {
      e.stopPropagation();
      video.play();
      video.currentTime=(e.offsetX*video.duration/this.offsetWidth).toPrecision(3);
    }


    // Set de la fonction Play/Pause
    function playPause() {
      if(video.paused) {
        video.play();
        play.classList.add('play');
        play.classList.remove('pause');
      }
      else {
        video.pause();
        play.classList.add('pause');
        play.classList.remove('play');
      }
    }

    // Set de la fonction MuteOn/muteOff
    function playerMuted() {
      if(video.muted == false) {
        video.muted = true;
        playerMute.classList.remove('playerOn');
        playerMute.classList.add('playerOff');
      }

      else {
        video.muted = false;
        playerMute.classList.add('playerOn');
        playerMute.classList.remove('playerOff');
      }
    }

  },
  initLocalStorage : function(){
    for (var i = 1; i < 9; i++) {
      if(!localStorage.getItem(i)){ // Si les keys n'existent pas déjà
        localStorage.setItem(i,"no");
      }
    };
  },
  setViewed : function(href){ // La vidéo vient d'être vue, modification du localStorage
    var splited = href.split('sk_');
    splited = splited[1];
    console.log(splited);
    splited = splited.split('.');
    splited = splited[0];
    localStorage.setItem(splited,'yes');
  }
};