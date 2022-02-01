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
	/*Variable Declarations*/
	var i=0;
	var fps={
		startTime:0,
		frameNumber:0,getFPS:function(){this.frameNumber++;var d=new Date().getTime(),currentTime=(d-this.startTime)/1000,result=Math.floor((this.frameNumber/currentTime));if( currentTime>1){this.startTime=new Date().getTime();this.frameNumber = 0;}return result;}};
	var framecounter=0;

	/*Canvas element sinks and context getters*/
	var parallaxCanvas3  = document.getElementById("parallaxLayer3");
	var parallaxCanvas2  = document.getElementById("parallaxLayer2");
	var parallaxCanvas1  = document.getElementById("parallaxLayer1");
	var parallaxCanvas0	 = document.getElementById("parallaxLayer0");
	var tileLayer 		 = document.getElementById("tileLayer");
	var gameLayer 		 = document.getElementById("gameLayer");
	var uiLayer			 = document.getElementById("uiLayer");
	var viewport  		 = document.getElementById("viewport");
	var objLayer         = document.getElementById("objectLayer")
	var prl3ctx 		 = parallaxCanvas3.getContext("2d");
	var prl2ctx 		 = parallaxCanvas2.getContext("2d");
	var prl1ctx 		 = parallaxCanvas1.getContext("2d");
	var prl0ctx			 = parallaxCanvas0.getContext("2d");
	var tctx			 = tileLayer.	   getContext("2d");
	var gctx  			 = gameLayer.	   getContext("2d");
	var uictx			 = uiLayer.		   getContext("2d");
	var vpctx 			 = viewport.	   getContext("2d");
	var objctx           = objLayer.       getContext("2d");
	
	/*Perenial variables*/
	var player;
	var camera;
	var hud;
	var scene;
	var level;
	var loadingTime = 100;
	var newGame=true;

	/*Environment variables*/
	var keys=[];
	var mouse=[];
	var friction = 0.8;
	var gravity = 0.8; 
	var width = 640;
	var height = 360;
	var mapWidth = 4000;
	var mapHeight = 496;

	/*Listener additions*/
	document.oncontextmenu=()=>false;
	gameLayer.addEventListener("initend", initEndHandler);
	document.body.addEventListener("keydown",function(ev){
											keys[ev.keyCode]=true;});
	document.body.addEventListener("keyup",function(ev){
											keys[ev.keyCode]=false;});
	document.body.addEventListener("mousedown",function(ev){
		ev.preventDefault();
		if (ev.button === 0)
      		mouse[0]=true;
  		else if (ev.button === 2 )
  			mouse[1]=true;
  		return false;
	},false);
	document.body.addEventListener("mouseup",function(ev){
		if (ev.button === 2){
			ev.preventDefault();
			mouse[1]=false;
		}
		if (ev.button === 0)
      		mouse[0]=false;
		return false;
	},false);
	/*Call initialization function*/
	initializeComponents();
	/*Initialization function*/
	function initializeComponents(){
		/*JAVASCRIPT PROMISE LOADING BLOCK*/
		/*promisearray for promise.all*/
		const loading = []

		var LEVEL = 1;
		level 	= new Level(LEVEL);
		hud 	= new HUD(640,360);
		player 	= new Player(level.respawnX,level.respawnY);
		camera 	= new Camera(player,width,height,1);
		scene 	= new Scene(parallaxCanvas3,parallaxCanvas2,
		    	parallaxCanvas1,parallaxCanvas0,
		    	tileLayer,mapWidth,mapHeight);

		loading.push(hud.loadHUD());
		loading.push(scene.loadScene(LEVEL,mapWidth,mapHeight));
		loading.push(player.loadPlayer(LEVEL));
		loading.push(level.loadLevel(LEVEL));

		/*resolve all*/
		Promise.all(loading).then(function(){
			var ev2 = new Event("initend");
			gctx.canvas.dispatchEvent(ev2);
		});
	}

	/*Sink for initialization completion event*/
	function initEndHandler(ev){
		if (newGame==true){
			scene.canPlay=true;
			newGame=false;
			scene.audioAmbient.currentTime=0;
			scene.playingAudio=false;
			scene.renderAudio();
		}
		/*Recieves the order from initializeComponents*/
		animationLoop();
	}
	/*gameLoop wrapper*/
	function animationLoop(){
		/*Establish gameloop using reqID for cancelAnimFrame()*/
		var al = function(time){
			animationLoop();
		}
		var reqID = window.requestAnimationFrame(al);
		/*Call gameLoop*/
		gameLoop(reqID);
	}
	/*Gameloop*/
	function gameLoop(){
		processInput();
		updateEntityData();
		renderScene();
	}
	/*1. Input processing stage for gameloop*/
	function processInput(){
		if (level.firstLevel){
			level.firstLoad();
		}
		if (level.levelDoor.triggered==true && level.levelDoor.exitOut==true){
			window.location.href = "Menus/htmlCode/menu3.html"
		}
		if (level.levelDoor.triggered==true && level.levelDoor.exitOut==false){
			level.nextLevel(vpctx,scene,player);
		}
		if (level.transitioning==true){
			return;
		}
		/*Recieve input*/
		player.recieveInput(keys,mouse);
		
	}
	/*2. Update all entity data with collision*/
	function updateEntityData(){
		for (var i=0; i<level.textBoxArray.length;i++){
			level.textBoxArray[i].updateInteractable(player,keys);
		}
		for (var i=0; i<level.textBoxArray.length;i++){
			if (level.textBoxArray[i].paused==true)
				return;
		}

		/*Update player*/
		player.update(mapWidth,mapHeight,gravity,friction,level.tileArray,level.enemyArray,level.bossArray,camera,level);

		/*Update enemies*/
		for (var i=0; i<level.enemyArray.length; i++){
			level.enemyArray[i].update(mapWidth,mapHeight,gravity,friction,level.tileArray,level.enemyArray,level.interactableArray,player);
		}
		for (var i=0; i<level.bossArray.length; i++){
			level.bossArray[i].update(mapWidth,mapHeight,gravity,friction,level.tileArray,level.enemyArray,level.interactableArray,player,camera);
		}

		/*Update Camera*/
		camera.updateCamera(player);  

		/*Update all interactables*/
		for (var i=0; i<level.interactableArray.length;i++){
			level.interactableArray[i].updateInteractable(player,keys);
			for (var i=0; i<level.bossArray.length;i++){
				if (level.bossArray[i].dead==true)
					level.interactableArray[i].locked=false;
			}
		}

		for (var i=0; i<level.textBoxArray.length;i++){
			level.textBoxArray[i].updateInteractable(player,keys);
		}
		
		/*Update the level Door*/
		level.levelDoor.updateInteractable(player,keys);

		/*Update actors*/
		for (var i=0; i<level.actorArray.length;i++){
			level.actorArray[0].updateInteractable(player,keys,camera,hud,level.textBoxArray[0]);
		}
	}
	/*3. Render everything*/
	function renderScene(){
		for (var i=0; i<level.textBoxArray.length;i++){
			if (level.textBoxArray[i].paused==true){
				level.textBoxArray[i].pauseBox.draw(vpctx);
				return;
			};
		}
		gctx.clearRect(0,0,mapWidth,mapHeight);

		/*Render actors*/
		for(var i=0; i<level.actorArray.length; i++){
			level.actorArray[i].drawActor(gctx);
		}
		
		/*Render player*/
		player.draw(gctx);
		player.renderAudio();
		//player.drawDebugInfo(gctx);
		
		
		/*Render enemies*/
		for (var i=0; i<level.enemyArray.length; i++){
			level.enemyArray[i].draw(gctx);
			level.enemyArray[i].renderAudio(player);
		}
		for (var i=0; i<level.bossArray.length; i++){
			//level.bossArray[i].drawDebugInfo(gctx);
			level.bossArray[i].draw(gctx);
			level.bossArray[i].renderAudio(player);
		}

		/*Draw all interactables*/
		for (var i=0; i<level.interactableArray.length; i++){
			level.interactableArray[i].draw(gctx);
		}
		for (var i=0; i<level.textBoxArray.length;i++){
			level.textBoxArray[i].draw(gctx);
		}

		/*Draw levelDoor*/
		level.levelDoor.drawDoor(gctx);

		/*Debug stuff*/
		//gctx.globalAlpha=0.5;
		//for (var i=0; i<level.tileArray.length; i++){level.tileArray[i].drawBoundingRect(gctx);}
		//gctx.globalAlpha=1;

		/*Draw the HUD*/
		hud.draw(uictx,player);

		for (var i=0; i<level.bossArray.length; i++){
			level.bossArray[i].drawHealthBar(uictx)
		}
		
		/*Draw any existing dialogues*/
		for(var i=0; i<level.actorArray.length; i++){
			level.actorArray[i].drawDialogue(uictx,keys);
		}

		/*Draw the layers into the viewport canvas*/
		vpctx.clearRect(0,0,width,height);
		scene.drawBackground(vpctx,camera);
		scene.drawForeground(vpctx,camera);
		vpctx.drawImage(gameLayer,
						Math.round(camera.x),
						Math.round(camera.y),
						camera.width,
						camera.height,
						0,0,
						camera.width,
						camera.height);
		vpctx.drawImage(uiLayer,0,0,width,height);

		
		if (player.dead==true)
			player.drawDeathScreen(vpctx);
		player.drawWinScreen(vpctx)
		if (level.transitioning==true)
			level.drawLoadingScreen(vpctx);
		vpctx.save();
		
		/*FPS*/
		// vpctx.font = "11px Serif";
		// vpctx.fillStyle="white";
		// vpctx.fillText(fps.getFPS() + "fps", 640-40, 15);

	}
}
//pMARTYR_0.8 ECMAscript Main
//Description: