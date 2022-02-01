class Boss extends Enemy{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.initx=x;
		this.inity=y;
		this.health 	= 600;
		this.collides 	= true;
		this.offense 	= 25;
		this.armor      = 0.6;
		this.range      = 70;
		this.defaultSpeed=0.5;
		this.eyesRange  = 200;
		this.patrolRange= 500;
		this.offsetY	= 100;
		this.value      = 15000;
		this.screamInit = true;
		this.scream50   = true;
		this.heading    = -1;
		this.attackRange= 60;
		this.unnoticed  = true;
		this.attackType = "small";
	}
	loadEnemy(enemyType){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=6;
			this.sprite = new Image();
			this.sprite.addEventListener("load", loadedHandler);
			this.sprite.src 	= "assets/enemy/enemy_"+enemyType+".png"

			this.barBackSprite = new Image();
			this.barBackSprite.src = "assets/ui/ui_bossBackground.png";

			this.barOverlay = new Image();
			this.barOverlay.src = "assets/ui/ui_bossOverlay.png";

			this.bars = new Image();
			this.bars.src = "assets/ui/ui_bars.png";

			// this.audioIdle = new Array();
			// for (var i=0; i<5; i++){
			// 	this.audioIdle[i] = new Audio();
			// 	this.audioIdle[i].addEventListener("load", loadedHandler);
			// 	this.audioIdle[i].src = "assets/audio/enemy/"+enemyType+"Idle"+(i+1)+".ogg";
			// }

			// this.audioDetect = new Audio();
			// this.audioDetect.src = "assets/audio/enemy/"+enemyType+"Detect.ogg";
			if (enemyType=="2armed"){
				enemyType="1armed";
			}

			
			this.audioHurt = new Array();
			for (var i=0; i<1; i++){
			 	this.audioHurt[i] = new Audio();
			 	this.audioHurt[i].volume=0.4;
			 	this.audioHurt[i].addEventListener('canplaythrough', loadedHandler);
			 	this.audioHurt[i].src = "assets/audio/enemy/"+enemyType+"Hurt"+(i+1)+".ogg";
			}

			this.audioAttack  = new Array();
			for (var i=0; i<2; i++){
				this.audioAttack[i] = new Audio();
				this.audioAttack[i].volume=0.2;
				this.audioAttack[i].addEventListener('canplaythrough', loadedHandler);
				this.audioAttack[i].src = "assets/audio/enemy/"+enemyType+"Attack"+(i+1)+".ogg";
			}

			this.audioAttackHit  = new Array();
			for (var i=0; i<2; i++){
				this.audioAttackHit[i] = new Audio();
				this.audioAttackHit[i].volume=0.3;
				this.audioAttackHit[i].addEventListener('canplaythrough', loadedHandler);
				this.audioAttackHit[i].src = "assets/audio/enemy/"+enemyType+"AttackHit"+(i+1)+".ogg";
			}

			this.audioFootsteps  = new Array();
			for (var i=0; i<1; i++){
				this.audioFootsteps[i] = new Audio();
				this.audioFootsteps[i].volume=0.05;
				this.audioFootsteps[i].addEventListener('canplaythrough', loadedHandler);
				this.audioFootsteps[i].src = "assets/audio/enemy/"+enemyType+"Foot"+(i+1)+".ogg";
			}
			this.audioMoan  = new Array();
			for (var i=0; i<1; i++){
				this.audioMoan[i] = new Audio();
				this.audioMoan[i].volume=0.6;
				this.audioMoan[i].addEventListener('canplaythrough', loadedHandler);
				this.audioMoan[i].src = "assets/audio/enemy/"+enemyType+"Moan"+(i+1)+".ogg";
			}
			this.audioAttackMoan  = new Array();
			for (var i=0; i<1; i++){
				this.audioAttackMoan[i] = new Audio();
				this.audioAttackMoan[i].volume=0.2;
				this.audioAttackMoan[i].addEventListener('canplaythrough', loadedHandler);
				this.audioAttackMoan[i].src = "assets/audio/enemy/"+enemyType+"MoanAttack"+(i+1)+".ogg";
			}

			this.audioDeath = new Audio();
			this.audioDeath.volume=0.5;
			this.audioDeath.addEventListener("load", loadedHandler);
			this.audioDeath.src = "assets/audio/enemy/"+enemyType+"Death.ogg";

			this.audioBlood = new Audio();
			this.audioBlood.volume=0.1;
			this.audioBlood.addEventListener("load", loadedHandler);
			this.audioBlood.src = "assets/audio/enemy/"+enemyType+"Blood.ogg";

			this.audioBloodExplosion = new Audio();
			this.audioBloodExplosion.volume=0.3;
			this.audioBloodExplosion.addEventListener("load", loadedHandler);
			this.audioBloodExplosion.src = "assets/audio/enemy/"+enemyType+"BloodExplosion.ogg";

			this.audioBigAttack= new Audio();
			this.audioBigAttack.volume=1;
			this.audioBloodExplosion.src = "assets/audio/enemy/"+enemyType+"BigAttack.ogg";

			this.battleMusic = new Audio();
			this.battleMusic.volume=0.5;
			this.battleMusic.src = "assets/audio/music/mu_"+enemyType+".ogg";

			this.audioGuttural = new Audio();
			this.audioGuttural.src = "assets/audio/enemy/"+enemyType+"Guttural.ogg";



			function loadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}
	update(mapWidth, mapHeight, gravity, friction, tileArray, enemyArray, interactArray, player,camera){
		if (player.dead==true){
			this.triggered=false
			return;
		}
		if (this.trulydead==true){
			return;
		}
		if (this.hurt==true){
			return;
		}
		
		this.brainFrame++;
		this.AI(player,camera);
		if (this.attacking==true && this.animFrame==4){

			camera.shake(4);
		}
		if (this.attacking==true && this.animFrame==4 && this.attackType=="big"){
			camera.shake(14);
		}
		if (this.triggered==false){
			if (this.heading==1){
				this.velX = this.defaultSpeed;
			}else{
				this.velX = -this.defaultSpeed;
			}
		}	
		if ((this.attacking==false && this.velX!=0) || this.velX!=0){
			this.walking=true;
		}
		if (this.velX==0){
			this.walking=false;
		}

		this.velY += gravity;
		var stepx = this.velX;
		var stepy = this.velY/2;
		this.centerX = this.x-this.width/2;
		this.centerY = this.y-this.height/2;
		if (this.stunned==false && this.attacking==false){
			this.lastYVar = this.yVar;
			this.x += stepx;
			this.yVar = (this.y+stepy)-this.y;
			this.y += stepy;
		}
		
		for (var i=0; i<tileArray.length; i++){
			if(this.checkCollision(tileArray[i]) == true)
					this.resolveCollision(tileArray[i]);
		}
		if (player.collides==true && this.dead==false && player.dead==false){
				if(this.checkCollision(player) == true)
					this.resolveCollision(player);
		}
		if (this.dead==true){
			this.velX-=0.1;
			this.velY=0;
			if (this.velX<0)
				this.velX=0;
		}		
	}
	attackCollide(entity){
	    var l1 = this.getLeft();
	    var t1 = this.getTop();
	    var r1 = this.getRight();
	    var b1 = this.getBottom();
	     
	    var l2 = entity.getLeft();
	    var t2 = entity.getTop();
	    var r2 = entity.getRight();
	    var b2 = entity.getBottom();

	    if (this.heading==1)
	    	{r1+=this.attackRange;
	    	l1+=this.width;}
	    else if (this.heading==-1)
	    	{l1-=this.attackRange;
	    	r1-=this.width;}

	    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2){
	        return false;
	    }else{
	    	return true;
	    }
	}
	respawn(){
		this.x=this.initx;
		this.y=this.iniy;
		this.unnoticed=true;
		this.attacking=false;
		this.walking=false;
		this.hurt=false;
		this.health=600;
		this.triggered=false;
		this.battleMusic.pause();
		this.battleMusic.currentTime=0;
	}
	draw(ctx){
		this.frame++;
		if (this.dead==false){
			if (this.hurt==false){
				if (this.walking==true && this.attacking==false && this.triggered==false){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*100, 0*this.offsetY,
								100,100,
								Math.floor(this.x), Math.floor(this.y), 100,100);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*100, 4*this.offsetY,
								100,100,
								Math.floor(this.x-40), Math.floor(this.y), 100,100);
					}
					if (this.frame%24==0){
						this.animFrame++;
					}
					if (this.animFrame>4){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.walking==true && this.attacking==false && this.triggered==true){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*100, 0*this.offsetY,
								100,100,
								Math.floor(this.x), Math.floor(this.y), 100,100);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*100, 4*this.offsetY,
								100,100,
								Math.floor(this.x-40), Math.floor(this.y), 100,100);
					}
					if (this.health>400){
						if (this.frame%6==0){
							this.animFrame++;
						}
					}else{
						if (this.frame%4==0){
							this.animFrame++;
						}
					}
					
					if (this.animFrame>4){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.attacking==true){
					if (this.attackType=="big"){
						if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*200, 1*this.offsetY,
								200,100,
								Math.floor(this.x-130), Math.floor(this.y), 200,100);
						}else{
							ctx.drawImage(this.sprite,
									this.animFrame*200, 5*this.offsetY,
									200,100,
									Math.floor(this.x-20), Math.floor(this.y), 200,100);
						}
						if (this.frame%8==0){
							this.animFrame++;
						}
						if (this.animFrame>8){
							this.frame=0;
							this.hasAttacked=false;
							this.attacking=false;
							this.animFrame=0;
						}
					}
					else{
						if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*100, 2*this.offsetY,
								100,100,
								Math.floor(this.x-40), Math.floor(this.y), 100,100);
						}else{
							ctx.drawImage(this.sprite,
									this.animFrame*100, 6*this.offsetY,
									100,100,
									Math.floor(this.x-20), Math.floor(this.y), 100,100);
						}
						if (this.frame%6==0){
							this.animFrame++;
						}
						if (this.animFrame>8){
							this.frame=0;
							this.hasAttacked=false;
							this.attacking=false;
							this.animFrame=0;
						}
					}
					
				}
			}else{
				if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*100, 3*this.offsetY,
								100,100,
								Math.floor(this.x-30), Math.floor(this.y), 100,100);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*100, 7*this.offsetY,
								100,100,
								Math.floor(this.x-15), Math.floor(this.y), 100,100);
					}
					if (this.frame%6==0){
						this.animFrame++;
					}
					if (this.animFrame>6){
						this.frame=0;
						this.hurt=false;
						this.animFrame=0;
					}
			}
		}else{
			if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*100, 8*this.offsetY,
								100,100,
								Math.floor(this.x), Math.floor(this.y), 100,100);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*100, 9*this.offsetY,
								100,100,
								Math.floor(this.x-20), Math.floor(this.y), 100,100);
					}
					if (this.frame%8==0){
						this.animFrame++;
					}
					if (this.animFrame>8){
						this.frame=0;
						this.trulydead=true;
						this.animFrame=9;
					}
		}
	}
	AI(player,camera){
		if (this.dead){return;}
		if (this.lookForPlayer(player)==true){
			this.triggered=true;
			this.patrolX = player.x;
		}
		if (player.dead==true){
			this.triggered=false;
		}
		if (this.triggered==true){
			var dist = this.x-player.x;
			if (Math.abs(dist)<this.range){
				this.velX=0;
				if (this.attackCollide(player) && this.attacking==false){
					var atk = getRandomInt(1,10);
					if (atk>7)
						{this.attackType="big";
						this.attackRange=180;

					}
					else
						{this.attackType="small";
						this.attackRange=30
					}
					this.frame=0;
					this.animFrame=0;
				}
				if (this.attackCollide(player) && this.hasAttacked==false){
					this.velX=0;
					this.attacking=true;
					this.walking=false;
					if (this.animFrame==4){
						this.hasAttacked=true;
						if (player.collides==true){
							var value = getRandomInt(0,2);
								this.audioAttackHit[value].pause();
								this.audioAttackHit[value].currentTime=0;
								this.audioAttackHit[value].play();
							if (this.attackType=="big")
								{this.audioBigAttack.play();
																player.recieveDamage(50,this.heading);}
							else
								{
								player.recieveDamage(25,this.heading);}
						}	
					}
				}
			}
			if (this.attacking==false){
				if (dist>=0){
					if (this.health < 300)
						this.velX=-3;
					else
						this.velX=-2;
					this.heading=-1;
				}else{
					if (this.health < 300)
						this.velX=3;
					else
						this.velX=2;
					this.heading=1;
				}
			}
		}
		else
		{
			this.behaviorFrame++;
			if (this.x < this.patrolX-this.patrolRange){
					this.velX = -this.velX;
					this.heading= -this.heading;
			}
			if (this.x > this.patrolX+this.patrolRange){
				this.velX = -this.velX;
				this.heading= -this.heading;
			}
		}
		if (player.x < this.patrolX-this.patrolRange-this.eyesRange){
			this.triggered=false;
		}
		if (player.x > this.patrolX+this.patrolRange+this.eyesRange){
			this.triggered=false;
		}
	}
	recieveDamage(damage,player){
		//OFFENSE IS PLAYER STRENGTH/SKILL
		/* As such, a skilled or stronger
		player should make better use of such
		weapons. A broken sword should, however,
		not be such a viable option, even at 
		higher strengths.*/
		/*So. A simple multiplier, and a random
		for simulation and a little bit of luck!*/
		this.triggered = true;
		this.velX=0;
		this.frame=0;
		this.animFrame=0;
		var value = getRandomInt(0,1);
		if (this.attacking==true && this.attackType=="small"){
			this.attacking=false;
			this.hurt=true;
			this.audioHurt[value].pause();
			this.audioHurt[value].currentTime=0;
			this.audioHurt[value].play();
		}
		if (this.attacking==false){
			this.audioHurt[value].pause();
			this.audioHurt[value].currentTime=0;
			this.audioHurt[value].play();
		}
		this.triggered=true;
		
	
		this.patrolX = this.x;
		this.health -= damage*this.armor;
		this.audioDeath.volume=0.4;
		this.kill(player);
	}
	drawHealthBar(ctx){
		if (this.trulydead==true){
			return;
		}
		if (this.triggered==false){
			return;
		}
		ctx.drawImage(this.barBackSprite,0,0);
		ctx.drawImage(this.bars,
					  0,0,
					  this.health/2,10,
					  164,331,
					  this.health/2,10);
		ctx.drawImage(this.barOverlay,0,0);
	}
	renderAudio(player){
		if (this.triggered==true && this.screamInit==true){
			this.audioGuttural.play();
			this.screamInit=false;
		}
		if (this.health<300 && this.scream50==true){
			this.audioGuttural.play();
			this.scream50=false;
		}
		if (this.dead){this.battleMusic.pause();return;}
		if (this.triggered==true){
			this.battleMusic.play();
		}
		if (this.walking==true && this.attacking==false && this.triggered==false){
			if (this.animFrame==2){	
				var value = getRandomInt(0,1);
				this.audioFootsteps[value].play()
			}
		}
		if (this.attacking==true){
				var value = getRandomInt(0,2);
				var value2 = getRandomInt(0,1);
				this.audioAttackMoan[value2].play();
				if (this.animFrame==4)
					{
						this.audioAttack[value].pause();
						this.audioAttack[value].currentTime=0;
						this.audioAttack[value].play();

					}
		}
		if (this.triggered==false){
			var decrement = getRandomInt(0,1);
			this.randomBehaviourCounter-=decrement;
			if (this.randomBehaviourCounter<0){
				value = getRandomInt(0,1);
				this.audioMoan[value].play();
				this.randomBehaviourCounter=50;
			}
		}
		if (this.walking==true && this.attacking==false && this.triggered==true){
			if (this.frame==2){	
				var value = getRandomInt(0,1);
				this.audioFootsteps[value].pause();
				this.audioFootsteps[value].currentTime=0;
				this.audioFootsteps[value].play()
			}
		}
	}
	kill(player){
		var trye = true;
		if (this.health<1){
			player.score+=this.value;
			if (trye==true){
				player.shouldDrawWin=true;
				trye =false;
			}
			this.audioDeath.play();
			this.audioBlood.play();
			this.audioBloodExplosion.play();
			this.collides=false;
			this.health=0;
			this.dead=true;
		}
	}
}