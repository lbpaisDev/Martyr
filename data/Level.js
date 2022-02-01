class Level{
	constructor(level){
		this.tileArray 			= new Array();
		this.actorArray 		= new Array();
		this.enemyArray 		= new Array();
		this.interactableArray  = new Array();
		this.textBoxArray       = new Array();
		this.bossArray          = new Array();
		this.level = level;
		this.transitioning = false;
		this.fadein=false;
		this.fadeout=false;
		this.ratio=0;
		this.animFrame=0;
		this.hold=false;
		this.firstLevel=true;
		if (level==1){
			this.respawnX = 380;
			this.respawnY = 255;
		}else if (level==2){
			this.respawnX = 420;
			this.respawnY = 190;
		}else if (level==3){
			this.respawnX = 370;
			this.respawnY = 190;
		}else if (level==4){
			this.respawnX = 450;
			this.respawnY = 126;
		}else if (level==5){
			this.respawnX = 380;
			this.respawnY = 255;
		}else if (level==6){
			this.respawnX = 380;
			this.respawnY = 255;
		}
		
	}
	firstLoad(){
		this.transitioning=true;
		this.fadein=true;
		this.ratio+=1;
		this.firstLevel=false;
		
	}
	reloadLevel(player){
		this.transitioning=true;
		player.collides=false;
		this.fadein=true;
		for (var i=0; i<this.bossArray.length; i++){
			this.bossArray[i].respawn();
		}
		if (this.hold==true){
			player.respawnX=this.respawnX;
			player.respawnY=this.respawnY;
			player.collides=true;
			player.respawn();
		}
		this.firstLevel=false;
	}
	nextLevel(ctx,scene,player){
		this.transitioning=true;
		player.collides=false;
		//player.openingDoor=true;
		this.fadein=true;
		if (this.hold==true){
			this.levelDoor.triggered=false;
			this.level++;
			if (this.level==5){
				scene.audioAmbient.pause();
				scene.audioAmbient.currentTime=0;
			}
			this.clearLevel();
			scene.clearScene();
			scene.loadScene(this.level);
			scene.canPlay=true;
			scene.audioAmbient.pause();
			scene.audioAmbient.currentTime=0;
			scene.playingAudio=false;
			scene.renderAudio(player);
			this.loadLevel(this.level);
			player.respawnX=this.respawnX;
			player.respawnY=this.respawnY;
			player.collides=true;
			player.respawn();
		}
		
	}
	drawLoadingScreen(ctx){
		if (this.transitioning==true){
			this.frame++;
		}
		if (this.fadein==true){
			this.ratio+=0.1;
			if (this.ratio>1){
				this.ratio=1;
				this.fadein=false;
				this.hold=true;
				this.frame=0;
			}
		}
		if (this.hold==true){
			if (this.frame%20==0){
				this.animFrame++;
				if (this.animFrame>3)
					this.animFrame=0;
			}
			if (this.frame>180){
				this.hold=false;
				this.fadeout=true;
			}
		}
		
		if (this.fadeout==true){
			this.ratio-=0.01;
			if (this.ratio<0){
				this.ratio=0;
				this.fadeout=false;
				this.transitioning=false;
			}
		}
		ctx.globalAlpha=this.ratio;
		ctx.fillStyle="black";
		ctx.fillRect(0,0,640,360);
		if (this.hold==true)
			ctx.drawImage(this.loading,0,19*this.animFrame,74,19,640-100,360-100,74,19);
		
		ctx.globalAlpha=1;
	}
	getLevelInfo(level){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', "code/level"+level+".txt", false);
		xmlhttp.send();
		var text = xmlhttp.responseText.split("\n");
		var newText = []
		for(var i = 0; i < text.length; i++){
			var temp = text[i].replace("(", "").replace(")", "").split(",").map(function(item){
				return parseInt(item, 10);
			});
			newText.push(temp);
		}
		return newText
	}
	loadLevelInfo(level){
		var levelInfo = this.getLevelInfo(level);
		for(var i = 0; i < levelInfo.length; i++){
			this.tileArray[i]  = new Tile(levelInfo[i][0],levelInfo[i][1],levelInfo[i][2],levelInfo[i][3],);
		}
	}
	loadLevel(level){
		return new Promise((resolve,reject)=>{
			const loading = [];
			this.loading 	 = new Image();
			this.loading.src ="assets/ui/ui_loading.png";

			if(level==1){
				this.respawnX = 380;
				this.respawnY = 255;

				this.loadLevelInfo(level);

				this.textBoxArray[0] = new TextBox(3319,256);
				this.textBoxArray[0].auto=true;
				loading.push(this.textBoxArray[0].loadTextbox("Weapons"));

				this.textBoxArray[1] = new TextBox(675,226);
				loading.push(this.textBoxArray[1].loadTextbox("Movement"));
					
				this.textBoxArray[2] = new TextBox(1274,226);
				loading.push(this.textBoxArray[2].loadTextbox("Combat"));
					
				this.textBoxArray[3] = new TextBox(3034,199);
				loading.push(this.textBoxArray[3].loadTextbox("Interaction"));

				this.interactableArray[0] = new Door(480,264,40,80);
				loading.push(this.interactableArray[0].loadDoor("Cell",1));

				this.actorArray[0] = new Actor("sittingKnight",3319,256,48,64);
				loading.push(this.actorArray[0].loadActor("sittingKnight",1));

				this.enemyArray[0] = new Enemy(2000,340,25,60);
				loading.push(this.enemyArray[0].loadEnemy("1armed"));

				this.levelDoor = new LevelDoor(3564,256);

				Promise.all(loading).then(function(){
					resolve();
				});
			}else if(level==2){
				this.respawnX = 420;
				this.respawnY = 190;
				
				this.loadLevelInfo(level);

				this.textBoxArray[0] = new TextBox(717,160);
				loading.push(this.textBoxArray[0].loadTextbox("Horde"));

				this.interactableArray[0] = new Door(0,0,40,80);
				loading.push(this.interactableArray[0].loadDoor("Cell",1));

				this.enemyArray[0] = new Enemy(2000,240,25,60);
				loading.push(this.enemyArray[0].loadEnemy("1armed"));

				this.enemyArray[1] = new Enemy(1300,240,25,60);
				loading.push(this.enemyArray[1].loadEnemy("2armed"));

				this.enemyArray[2] = new Enemy(1700,240,25,60);
				loading.push(this.enemyArray[2].loadEnemy("1armed"));

				this.enemyArray[3] = new Enemy(1800,240,25,60);
				loading.push(this.enemyArray[3].loadEnemy("2armed"));

				this.enemyArray[4] = new Enemy(2300,240,25,60);
				loading.push(this.enemyArray[4].loadEnemy("2armed"));

				this.enemyArray[5] = new Enemy(2500,240,25,60);
				loading.push(this.enemyArray[5].loadEnemy("2armed"));

				this.enemyArray[6] = new Enemy(2700,240,25,60);
				loading.push(this.enemyArray[6].loadEnemy("1armed"));

				this.enemyArray[7] = new Enemy(3000,240,25,60);
				loading.push(this.enemyArray[7].loadEnemy("1armed"));

				this.enemyArray[8] = new Enemy(3300,240,25,60);
				loading.push(this.enemyArray[8].loadEnemy("1armed"));

				this.enemyArray[9] = new Enemy(3400,240,25,60);
				loading.push(this.enemyArray[9].loadEnemy("1armed"));

				this.levelDoor = new LevelDoor(3479,316);

				Promise.all(loading).then(function(){
					resolve();
				});
			}else if(level==3){
				this.respawnX = 420;
				this.respawnY = 190;
				
				this.loadLevelInfo(level);

				this.textBoxArray[0] = new TextBox(575,198);
				this.textBoxArray[0].auto=true;
				loading.push(this.textBoxArray[0].loadTextbox("Flask"));

				this.interactableArray[0] = new Door(688,170,58,140);
				loading.push(this.interactableArray[0].loadDoor("Iron",1));
					
				this.actorArray[0] = new Actor("holyPriest",575,198,48,84);
				loading.push(this.actorArray[0].loadActor("holyPriest",3));

				this.enemyArray[0] = new Enemy(2000,240,25,60);
				loading.push(this.enemyArray[0].loadEnemy("1armed"));

				this.enemyArray[1] = new Enemy(1300,240,25,60);
				loading.push(this.enemyArray[1].loadEnemy("2armed"));

				this.enemyArray[2] = new Enemy(1700,240,25,60);
				loading.push(this.enemyArray[2].loadEnemy("1armed"));

				this.enemyArray[3] = new Enemy(1800,240,25,60);
				loading.push(this.enemyArray[3].loadEnemy("2armed"));

				this.levelDoor = new LevelDoor(3108,316);

				Promise.all(loading).then(function(){
					resolve();
				});
			}else if(level==4){
				this.respawnX = 450;
				this.respawnY = 126;
				
				this.loadLevelInfo(level);

				this.interactableArray[0] = new Door(1840,330,58,140);
				this.interactableArray[0].locked=false;
				loading.push(this.interactableArray[0].loadDoor("Iron",1));

				this.enemyArray[0] = new Enemy(2000,240,25,60);
				loading.push(this.enemyArray[0].loadEnemy("1armed"));

				this.enemyArray[1] = new Enemy(1300,240,25,60);
				loading.push(this.enemyArray[1].loadEnemy("2armed"));

				this.enemyArray[2] = new Enemy(1700,240,25,60);
				loading.push(this.enemyArray[2].loadEnemy("1armed"));

				this.enemyArray[3] = new Enemy(1800,240,25,60);
				loading.push(this.enemyArray[3].loadEnemy("2armed"));

				this.enemyArray[4] = new Enemy(2300,240,25,60);
				loading.push(this.enemyArray[4].loadEnemy("2armed"));

				this.enemyArray[5] = new Enemy(2500,240,25,60);
				loading.push(this.enemyArray[5].loadEnemy("2armed"));

				this.enemyArray[6] = new Enemy(2700,240,25,60);
				loading.push(this.enemyArray[6].loadEnemy("1armed"));

				this.enemyArray[7] = new Enemy(3000,240,25,60);
				loading.push(this.enemyArray[7].loadEnemy("1armed"));

				this.enemyArray[8] = new Enemy(3300,240,25,60);
				loading.push(this.enemyArray[8].loadEnemy("1armed"));

				this.enemyArray[9] = new Enemy(3400,240,25,60);
				loading.push(this.enemyArray[9].loadEnemy("1armed"));

				this.levelDoor = new LevelDoor(3815,178);

				Promise.all(loading).then(function(){
					resolve();
				});
			}else if (level==5){
				this.respawnX = 380;
				this.respawnY = 255;
				
				this.loadLevelInfo(level);

				this.actorArray[0] = new Actor("holyPriest",3390,263,48,84);
				loading.push(this.actorArray[0].loadActor("holyPriest",5));

				this.textBoxArray[0] = new TextBox(575,198);
				this.textBoxArray[0].auto=true;
				loading.push(this.textBoxArray[0].loadTextbox("Final"));

				this.interactableArray[0] = new Door(2808,234,58,140);
				this.interactableArray[0].locked=true;
				loading.push(this.interactableArray[0].loadDoor("IronAlt",5));

				this.levelDoor = new LevelDoor(3590,263);
				this.levelDoor.exitOut=true;

				this.bossArray[0] = new Boss(2000,234,60,100);
				loading.push(this.bossArray[0].loadEnemy("Warden"));


				Promise.all(loading).then(function(){
					resolve();
				});

			}
		});
	}
	clearLevel(){
		this.tileArray.length			=0;
		this.actorArray.length			=0;
		this.enemyArray.length			=0;
		this.textBoxArray.length		=0;
		this.interactableArray.length	=0;
	}
}



