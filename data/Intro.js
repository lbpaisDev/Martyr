(function(){window.addEventListener("load", main);}());
(function(){
	var requestAnimationFrame = 
   	   window.requestAnimationFrame 
   	|| window.mozRequestAnimationFrame
   	|| window.webkitRequestAnimationFrame
   	|| window.msRequestAnimationFrame;
   	   window.requestAnimationFrame=requestAnimationFrame;
})();
function main(){
	var frame = document.getElementsByTagName("iframe")[0];
	var viewport = document.getElementById("viewport");
	var vpctx = viewport.getContext("2d");
	
	var music = new Audio();
	var background = new Image();
	var skip = new Image();
	var frameCounter=0;
	var ratio=1;
	var keys = [];
	document.body.addEventListener("keydown",function(ev){ keys[ev.keyCode]=true;  });
	document.body.addEventListener("keyup",  function(ev){ keys[ev.keyCode]=false; });
	initializeComponents();
	function initializeComponents(){
		var nLoad=0;
		var totLoad=3;
		music.addEventListener("canplaythrough",loadHandler);
		music.src = "assets/audio/music/mu_intro.mp3";
		music.volume = 0.4;
		background.addEventListener("load",loadHandler);
		background.src = "assets/ui/ui_intro.png";
		skip.addEventListener("load",loadHandler);
		skip.src = "assets/ui/ui_skip.png";

		function loadHandler(ev){
			nLoad++;
			if (nLoad==totLoad){
				introLoop();
			}
		}
	}
	function introLoop(){
		var t = function(time){
			introLoop();
		}
		var reqID = window.requestAnimationFrame(t);
		music.play();
		animationLoop(reqID);
	}

	function animationLoop(reqID){
		if (keys[69]){
			frameCounter=1800;
		}
		frameCounter+=0.5;
		vpctx.clearRect(0,0,640,360);
		if (frameCounter>1500){
			ratio-=0.01;
			if (ratio<=0){
				ratio=0;
				cancelAnimationFrame(reqID);
  				window.location.href = "Game.html";
			}
		}
		vpctx.globalAlpha=ratio;
		vpctx.drawImage(background,0,-440+frameCounter,640,360,0,0,640,360);
		vpctx.drawImage(skip,640-43,320);
	}
}