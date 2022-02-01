function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;}

class Enemy extends Entity{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.health 	= 100;
		this.collides 	= true;
		this.offense 	= 25;
		this.armor      = 0.3;
		this.range      = 54;
		this.eyesRange  = 150;
		this.value      = 150;

		this.velX = 1;
		this.defaultSpeed = 1;

		this.heading    = 1;
		this.walking    = false;
		this.running    = false;
		this.attacking  = false;
		this.hasAttacked= false;
		this.hurt       = false;
		this.dead       = false;
		this.stunned    = false;
		this.trulydead  = false;

		this.brainFrame     = 0;
		this.brainCycle     = 10;
		this.triggered      = false;
		this.patrolX 		= x-w/2;
		this.patrolRange    = 300;
		this.chaseRange     = this.patrolRange+this.eyesRange;
		this.pushBack       = 0;
		this.frame          = 0;
		this.animFrame      = 0;
		this.sprite         = undefined;
		this.offsetY        = 57;
		this.drawRatio      = 1;
		this.randomBehaviourCounter = 10;
		this.attackDebuff   = 60;
		this.reverseCounter = 10;
		this.correctFrame   = 0;
		this.lastX          = 0;
		this.canAttack = true;
	}

	loadEnemy(enemyType){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=6;
			this.sprite = new Image();
			this.sprite.addEventListener("load", loadedHandler);
			this.sprite.src 	= "assets/enemy/enemy_"+enemyType+".png"

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



			function loadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}

	/*Attack Collision*/
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
	    	{r1+=this.range;
	    	l1+=this.width;}
	    else if (this.heading==-1)
	    	{l1-=this.range;
	    	r1-=this.width;}

	    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2){
	        return false;
	    }else{
	    	return true;
	    }
	}

	/*Brain*/
	AI(player){
		if (this.dead==true)
			return
		if (this.stunned==true)
			return
		if (this.lookForPlayer(player)==true){
			this.triggered=true;
			this.patrolX = player.x;
		}
		if (player.dead==true){
			this.triggered=false;
		}
		if (this.triggered==true){
			var dist = this.x-player.x;
			if (this.attacking==false){
				if (dist>=0){
					this.velX=-2;
					this.heading=-1;
				}else{
					this.velX=2;
					this.heading=1;
				}
			}
			if (Math.abs(dist)<this.range){
				this.velX=0;
				if (this.attackCollide(player) && this.attacking==false){
					this.frame=0;
					this.animFrame=0;
				}
				if (this.attackCollide(player) && this.hasAttacked==false){
					this.velX=0;
					this.attacking=true;
					this.walking=false;

					if (this.animFrame==4){
						this.hasAttacked=true;
						if (player.collides==true)
							player.recieveDamage(this.offense,this.heading);
					}
				}
			}
		}else{
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
	
	/*Trigger for chase behaviour*/
	lookForPlayer(entity){
		var l1 = this.getLeft();
	    var t1 = this.getTop()+5;
	    var r1 = this.getRight();
	    var b1 = this.getBottom()-5;
	     
	    var l2 = entity.getLeft();
	    var t2 = entity.getTop();
	    var r2 = entity.getRight();
	    var b2 = entity.getBottom();

	    if (this.heading==1){
	    	r1 += this.eyesRange;
	    	l1 += this.width;
	    }
	    else{
	    	l1 -= this.eyesRange;
	    	r1 -= this.width;
	    }
	    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2){
	        return false;
	    }else{
	    	return true;
	    }
	}

	/*Collision checker for entity collision*/
	checkCollision(entity){
	    var l1 = this.getLeft();
	    var t1 = this.getTop();
	    var r1 = this.getRight();
	    var b1 = this.getBottom();
	     
	    var l2 = entity.getLeft();
	    var t2 = entity.getTop();
	    var r2 = entity.getRight();
	    var b2 = entity.getBottom();

	    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2){
	        return false;
	    }else{
	    	return true;
	    }
	}

	/*Collision resolver (buggy)*/
	resolveCollision(entity){
	    // Find the mid points of the entity and player
	    var pMidX = this.getMidX();
	    var pMidY = this.getMidY();
	    var aMidX = entity.getMidX();
	    var aMidY = entity.getMidY();
	     
	    // To find the side of entry calculate based on the normalized sides
	    var dx = (aMidX - pMidX) / entity.width/2;
	    var dy = (aMidY - pMidY) / entity.height/2;
	     
	    // Calculate the absolute change in x and y
	    var absDX = Math.abs(dx);
	    var absDY = Math.abs(dy);
	     
	    // If the distance between the normalized x and y position is less than a small threshold (.1 in this case)
	    // then this object is approaching from a corner
	    if (Math.abs(absDX - absDY) < .0001) {
	        // If the player is approaching from positive X
	        if (dx < 0) {
	            // Set the player x to the right side
	            this.x = entity.getRight();
	            this.velX = 0;
	        // If the player is approaching from negative X
	        } else {
	            // Set the player x to the left side
	            this.x = entity.getLeft() - this.width;
	            this.velX = 0;
	        }
	        // If the player is approaching from positive Y
	        if (dy < 0) {
	            // Set the player y to the bottom
	            this.y = entity.getBottom();
	        // If the player is approaching from negative Y
	        } else {
	            // Set the player y to the top
	           	this.y = entity.getTop() - this.height;
	           	if (this.velY>=0){
	            	this.velY = 0;
	            }
	        }

	    // If the object is approaching from the sides
	    } else if (absDX > absDY) {
	        // If the player is approaching from positive X
	        if (dx < 0){
	            this.x = entity.getRight();
	            this.velX = 0;
	        } else {
	        // If the player is approaching from negative X
	            this.x = entity.getLeft() - this.width;
	            this.velX = 0;
	        }
	   
	    // If this collision is coming from the top or bottom more
	    } else {
	        // If the player is approaching from positive Y
	        if (dy < 0) {
	            this.y = entity.getBottom();

	        } else {
	        // If the player is approaching from negative Y
	            this.y = entity.getTop() - this.height;
	            if (this.velY>=0){
	            	this.velY = 0;
	            }
	        }
	    }
	}

	/*Updater*/
	update(mapWidth, mapHeight, gravity, friction, tileArray, enemyArray, interactArray, player){
		if (player.dead==true){
			this.triggered=false
			return;
		}
		if (this.trulydead==true){
			return;
		}
		
		this.brainFrame++;
		this.AI(player);
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
		for (var i=0; i<interactArray.length; i++){
			if(this.checkCollision(interactArray[i].doorEntity) == true && interactArray[i].opened==false)
					this.resolveCollision(interactArray[i].doorEntity);
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

		if (this.x==this.lastX && this.triggered==false){
				this.velX=-this.velX;
				this.heading=-this.heading;
		}
		this.lastX=this.x;
	}

	renderAudio(player){
		var percent = ((player.x*100)/this.x);
		if (percent<60){
			return;
		}
		if (this.walking==true && this.attacking==false && this.triggered==false){
			if (this.frame==3*14){	
				var value = getRandomInt(0,1);
				this.audioFootsteps[value].play()
			}
			if (this.frame==(7*14)-2){	
				var value = getRandomInt(0,1);
				this.audioFootsteps[value].play()
			}
		}
		if (this.attacking==true){
				var value = getRandomInt(0,2);
				var value2 = getRandomInt(0,1);
				var decides = getRandomInt(0,5);
				if (decides>2 && this.frame==3*4){
					this.audioAttackMoan[value2].pause();
					this.audioAttackMoan[value2].currentTime=0;
					this.audioAttackMoan[value2].play();
				}
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
			if (this.frame==(3*6)-2){	
				var value = getRandomInt(0,1);
				this.audioFootsteps[value].play()
			}
		}
	}

	/*Draw method*/
	draw(ctx){
		this.frame++;
		//this.drawDebugInfo(ctx)
		if (this.dead==false){
			ctx.globalAlpha=0.7;
			ctx.fillStyle="black";
			if (this.heading==1)
				ctx.fillRect(this.x-18,this.y-10,100/2,3);
			else
				ctx.fillRect(this.x-10,this.y-10,100/2,3);
			ctx.fillStyle="red";
			if (this.heading==1)
				ctx.fillRect(this.x-18,this.y-10,this.health/2,3);
			else
				ctx.fillRect(this.x-10,this.y-10,this.health/2,3);
			ctx.globalAlpha=1;
		}
		if (this.dead==false){
			if (this.hurt==false){
				if (this.walking==false && this.attacking==false && this.triggered==false){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*69, 0*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*69, 5*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}
					
					if (this.frame%6==0){
						this.animFrame++;
					}
					if (this.animFrame>2){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.walking==true && this.attacking==false && this.triggered==false){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*69, 2*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*69, 7*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}
					if (this.frame%14==0){
						this.animFrame++;
					}
					if (this.animFrame>6){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.walking==true && this.attacking==false && this.triggered==true){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*69, 2*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*69, 7*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}
					if (this.frame%6==0){
						this.animFrame++;
					}
					if (this.animFrame>6){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.walking==false && this.attacking==false && this.triggered==true){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*69, 0*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*69, 5*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}
					if (this.frame%4==0){
						this.animFrame++;
					}
					if (this.animFrame>2){
						this.frame=0;
						this.animFrame=0;
					}
				}
				if (this.attacking==true){
					if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*86, 3*this.offsetY,
								86,57,
								Math.floor(this.x-45), Math.floor(this.y+4), 86,57);
						if (this.animFrame>3)
						this.correctFrame-=0.7;
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*86, 8*this.offsetY,
								86,57,
								Math.floor(this.x-10), Math.floor(this.y+4), 86,57);
					}
					if (this.frame%6==0){
						this.animFrame++;
					}
					
					if (this.animFrame>11){
						this.correctFrame=0;
						this.frame=0;
						this.hasAttacked=false;
						this.attacking=false;
						this.animFrame=0;
					}
				}
			}
			if (this.hurt==true || this.stunned==true){
				if (this.heading==-1){
						ctx.drawImage(this.sprite,
								this.animFrame*69, 1*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}else{
						ctx.drawImage(this.sprite,
								this.animFrame*69, 6*this.offsetY,
								69,57,
								Math.floor(this.x-20), Math.floor(this.y+4), 69,57);
					}
					if (this.frame%8==0){
						this.animFrame++;
					}
					if (this.animFrame>6){
						this.frame=0;
						this.hasAttacked=false;
						this.hurt=false;
						this.stunned=false;
						this.animFrame=0;
					}
			}
		}
		else{
			ctx.globalAlpha=this.drawRatio;
			if (this.heading==-1){
				ctx.drawImage(this.sprite,
					this.animFrame*79, 4*this.offsetY,
					79,57,
					Math.floor(this.x+this.animFrame*3), Math.floor(this.y+4), 79,57);
			}else{
				ctx.drawImage(this.sprite,
					this.animFrame*79, 9*this.offsetY,
					79,57,
					Math.floor(this.x-this.width-this.animFrame*2), Math.floor(this.y+4), 79,57);
			}
			ctx.globalAlpha=1;		
			if (this.frame%6==0){
				this.animFrame++;
			}
			if (this.animFrame>6){
				this.animFrame=7;
			}
			if (this.frame>60){
				this.drawRatio-=0.1;
				if (this.drawRatio<0){
					this.drawRatio=0;
					this.trulydead=true;
				}
			}
		}
	}

	/*Debug stuff*/
	drawDebugInfo(ctx){
		if (this.dead==false){
			ctx.fillText("walkin"+this.walking,this.x, this.y-50);
			ctx.fillText("atackin"+this.attacking,this.x, this.y-40);
			ctx.fillText("trigg"+this.triggered,this.x, this.y-30);
			ctx.fillText("STUNNNNED"+this.stunned,this.x, this.y-20);
			if (this.triggered==true){
					ctx.fillText("TRIGGERED",this.x,this.y);
				}
				ctx.globalAlpha=0.1;
				ctx.fillRect(this.patrolX-this.patrolRange,0,this.patrolRange*2,500);
				ctx.fillRect(this.patrolX-this.patrolRange,0,16,500);
				ctx.fillRect(this.patrolX+this.patrolRange-16,0,16,500);
				ctx.fillStyle = "purple";
				ctx.fillRect(this.patrolX-this.chaseRange,0,this.chaseRange*2,500);
				ctx.fillStyle = "black";
				ctx.globalAlpha=1;
				if (this.attacking==true){
					ctx.fillRect(this.x-this.range,this.y,this.range,this.height);
				}
				ctx.globalAlpha=1;
				ctx.fillText(this.health,this.x, this.y-10);
				ctx.fillStyle="red";
				if (this.health>0){
					this.drawBoundingRect(ctx);
					if (this.heading==1){
						ctx.globalAlpha=0.3;
						ctx.fillStyle="yellow";
						ctx.fillRect(this.x+this.width, this.y+5, this.eyesRange, this.height-10);
						ctx.globalAlpha=1;
					}else{
						ctx.globalAlpha=0.3;
						ctx.fillStyle="yellow";
						ctx.fillRect(this.x-this.eyesRange, this.y+5, this.eyesRange, this.height-10);
						ctx.globalAlpha=1;
					}
				}
				else{
					ctx.globalAlpha=0.5;
					this.drawBoundingRect(ctx);
				}}
	}

	/*Get hit*/
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
		this.triggered=true;
		this.attacking=false;
		this.walking=false;
		var value = getRandomInt(0,1);
		this.audioHurt[value].pause();
		this.audioHurt[value].currentTime=0;
		this.audioHurt[value].play();

		this.hurt=true;
		this.stunned=true;

		this.patrolX = this.x;
		this.health -= damage;
		
		this.kill(player);
	}

	kill(player){
		if (this.health<1){
			if(this.heading==1){
			this.velX-=100;
			}else{
			this.velX+=100;
			}
			player.score+=this.value;
			
			this.audioDeath.play();
			this.audioBlood.play();
			this.audioBloodExplosion.play();
			this.collides=false;
			this.health=0;
			this.dead=true;
		}
	}
}