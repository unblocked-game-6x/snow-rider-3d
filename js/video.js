/*"use strict";

var video_intro = document.getElementById('video_intro');
var cache_video = document.getElementById('cacheVideo');
var mute = document.getElementById('onOff');
var intro = document.getElementById('textIntro');


video_intro.addEventListener('canplaythrough',loaded,false);
video_intro.addEventListener('timeupdate',progress,false);
mute.addEventListener('click',muted,false);

video_intro.play();

function loaded() {
	video_intro.play();
	video_intro.muted = false;
	mute.classList.add('on');
}


function muted() {
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

function progress() {
	var self = this
	var current_time = Math.round(self.currentTime*100/self.duration);


	if(current_time == 0) {
		cache_video.classList.add('cacheVideo');
		intro.style.display="block";
		intro.classList.add('textIntro');
	}	
	
}
*/