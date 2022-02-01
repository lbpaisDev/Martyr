function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;}

class Player extends Entity{
	/*Complex constructor for player class*/
	constructor(x,y){
		/*Entity Data*/
		super(x,y,20,50,0,0);

		/*Sprite*/
		this.sprite 		= undefined;
		this.offsetX		= 68;
		this.offsetY		= 60;
		this.animFrame		= 0;
		this.frame      	= 0;
		this.headOffset 	= 9*this.offsetY;
		this.drawRatio      = 0;
		this.drawWinRatio   = 0;
		this.deadFrame      = 0;
		this.shouldDrawDeath= true;
		this.shouldDrawWin	=false;
		this.winFrame		=0;
		this.isDrawn		=false;

		/*Player Stats*/
		this.speed			= 7;
		this.health 		= 100;
		this.stamina 		= 50;

		this.offense 		= 25;
		this.defense 		= 0;
		this.weapon			= 0;
		this.range          = 25;
		
		this.regen			= 0.5;
		this.hpRegen	    = 0;
		this.potionCharges  = 4;
		this.maxPotions     = this.potionCharges;

		/*Player States*/
		this.heading 	= 1;
		this.level      = 1;
		this.hurt 		= false;
		this.attacking	= false;
		this.blocking   = false;
		this.moving 	= false;
		this.walking    = false;
		this.dodging 	= false;
		this.jumping 	= false;
		this.falling	= false;
		this.spawning	= false;
		this.healing 	= false;
		this.locked		= false;
		this.collides	= true;
		this.hasPotion  = false;
		this.hasHitEnemy= false;
		this.hasAttacked= false;
		this.jumpExhaust= 0;
		this.lastYVar   = 0;
		this.iFrame		= 0;
		this.yVar       = 0;
		

		/*Other Specifics*/
		this.respawnX 	= this.x;
		this.respawnY	= this.y;
		this.maxHealth	= this.health;
		this.maxStamina = this.stamina;
		this.score		= 0;
	}

	/*Attribute loader*/
	loadPlayer(){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=6+5+4+3+3+2+1+3;
			var weapon = this.weapon;
			var level = "stone";
			this.sprite = new Image();
			this.sprite.addEventListener("load", loadedHandler);
			this.sprite.src 	= "assets/player/playerWep"+weapon+".png"

			this.deathScreen = new Image();
			this.deathScreen.addEventListener("load", loadedHandler);
			this.deathScreen.src 	= "assets/player/deathScreen.png"

			this.winScreen = new Image();
			this.winScreen.src 	= "assets/player/victoryScreen.png"


			this.audioActionFootLeft    = new Array();
			for (var i=0; i<2; i++){
				this.audioActionFootLeft[i] = new Audio();
				this.audioActionFootLeft[i].volume = 0.3;
				this.audioActionFootLeft[i].addEventListener("load", loadedHandler);
				this.audioActionFootLeft[i].src = "assets/audio/player/step_"+level+"Left"+(i+1)+".ogg";
				
			}
			this.audioActionFootRight   = new Array();
			for (var i=0; i<3; i++){
				this.audioActionFootRight[i] = new Audio();
				this.audioActionFootRight[i].volume = 0.3;
				this.audioActionFootRight[i].addEventListener("load", loadedHandler);
				this.audioActionFootRight[i].src = "assets/audio/player/step_"+level+"Right"+(i+1)+".ogg";
				
			}
			this.audioAttack   			= new Array();
			for (var i=0; i<3; i++){
				this.audioAttack[i] 	= new Audio();
				this.audioAttack[i].volume = 0.3;
				this.audioAttack[i].addEventListener("load", loadedHandler);
				this.audioAttack[i].src = "assets/audio/player/dmg_"+weapon+"attack"+(i+1)+".ogg";
				

			}
			this.audioAttackHit    	= new Array();
			for (var i=0; i<3; i++){
				this.audioAttackHit[i] 	= new Audio();
				this.audioAttackHit[i].addEventListener("load", loadedHandler);
				this.audioAttackHit[i].src = "assets/audio/player/dmg_"+weapon+"hit"+(i+1)+".ogg";
			}
			this.audioHurtGrunt = new Array();
			for (var i=0; i<4; i++){
				this.audioHurtGrunt[i] 	= new Audio();
				this.audioHurtGrunt[i].volume=0.4;
				this.audioHurtGrunt[i].addEventListener("load", loadedHandler);
				this.audioHurtGrunt[i].src = "assets/audio/player/hurt_grunt"+(i+1)+".ogg";
			}
			this.audioDamageBlood    	= new Array();
			for (var i=0; i<2; i++){
				this.audioDamageBlood[i] 	= new Audio();
				this.audioDamageBlood[i].addEventListener("load", loadedHandler);
				this.audioDamageBlood[i].src = "assets/audio/player/dmg_blood"+(i+1)+".ogg";
			}

			this.audioActionRolling = new Audio();	
			this.audioActionRolling.volume = 0.2;	
			this.audioActionRolling.addEventListener("load", loadedHandler);
			this.audioActionRolling.src = "assets/audio/player/action_0dodgeRoll.ogg";
			
			this.audioActionJumping = new Audio();
			this.audioActionJumping.volume = 0.3;
			this.audioActionJumping.addEventListener("load", loadedHandler);
			this.audioActionJumping.src = "assets/audio/player/action_0jumping.ogg";

			this.audioFail = new Audio();
			this.audioFail.src="assets/audio/ui/ui_fail.ogg";

			this.audioVictory = new Audio();
			this.audioVictory.src="assets/audio/player/ui_victory.ogg";
			
			this.audioActionRuffle = new Audio();
			this.audioActionRuffle.addEventListener("load", loadedHandler);
			this.audioActionRuffle.src  = "assets/audio/player/action_0unarmedDraw.ogg";
			
			this.audioActionLanding = new Audio();
			this.audioActionLanding.addEventListener("load", loadedHandler);
			this.audioActionLanding.src = "assets/audio/player/action_0landing.ogg";
			
			this.audioHurtDeath = new Audio();
			this.audioHurtDeath.volume=0.3;
			this.audioHurtDeath.addEventListener("load", loadedHandler);
			this.audioHurtDeath.src  = "assets/audio/player/hurt_death.ogg";

			this.audioItemPotion = new Audio();
			this.audioItemPotion.addEventListener("load", loadedHandler);
			this.audioItemPotion.src  = "assets/audio/player/ui_potion.ogg";

			this.audioBlood=new Audio();
			this.audioBlood.volume=0.4;
			this.audioBlood.src="assets/audio/player/dmg_explosion.ogg";
			this.audioUIDead=new Audio();
			this.audioUIDead.volume=0.4;
			this.audioUIDead.src="assets/audio/player/ui_deathHit.ogg";
			
			function loadedHandler(ev){
				var img = ev.target;
				nLoad++;
				if (nLoad = maxLoad){
					resolve();
				}
			}
		});
	}

	/*Reload after weapon acquisition*/
	reloadPlayer(){
		this.sprite.src 	= "assets/player/playerWep"+this.weapon+".png"
		for (var i=0; i<this.audioAttack.length; i++){
				this.audioAttack[i].src = "assets/audio/player/dmg_"+this.weapon+"attack"+(i+1)+".ogg";
				

		}
		for (var i=0; i<this.audioAttackHit.length; i++){
				this.audioAttackHit[i].src = "assets/audio/player/dmg_"+this.weapon+"hit"+(i+1)+".ogg";
		}
	}

	/*Attribute resetter*/
	respawn(){
		if (this.dead==true){
			this.health		= this.maxHealth;
			this.stamina	= this.maxStamina;
		}
		this.x 			= this.respawnX;
		this.y 			= this.respawnY;
		this.hurt 		= false;
		this.hurt 		= false;
		this.attacking	= false;
		this.blocking   = false;
		this.moving 	= false;
		this.hpRegen      = 0;
		this.walking    = false;
		this.dodging 	= false;
		this.jumping 	= false;
		this.falling	= false;
		this.spawning	= false;
		this.healing 	= false;
		this.locked		= false;
		this.collides	= true;
		this.hasHitEnemy= false;
		this.hasAttacked= false;
		this.potionCharges = this.maxPotions;
		this.dead 	 	= false;
	}

	/*Input sink for keys and mouse!*/
	recieveInput(keys,mouse){
		if (this.dead==true)
			return;
		/*Block preempt handling*/
		if (this.blocking==true){
			if (mouse[1]==false){
				this.locked 	= false;
				this.blocking 	= false;
			}
		}
		/*Check for lock state*/
		if (this.locked==false){
			/*Attacking*/
			if (mouse[0] && this.jumping==false && this.dodging==false){
				mouse[0]=false;
				if (this.stamina >= 10){
	       			this.frame=0;
	       			this.regen = 0;
	       			this.moving 	= true;
					this.walking    = false;
					this.dodging 	= false;
					this.falling	= false;
					this.spawning	= false;
					this.attacking  = true;
					this.locked		= true;
					this.animFrame 	= 0;
		   			this.stamina 	-= 10;
	       		}else{
	       			if (this.attacking==false)
	       				this.audioFail.play();
	       		}
			}
			/*Blocking*/
			if (mouse[1] && this.jumping==false && this.dodging==false){
	       		this.frame=0;
	       		this.regen = 0;
	       		this.moving 	= false;
				this.walking    = false;
				this.dodging 	= false;
				this.falling	= false;
				this.spawning	= false;
				this.attacking  = false;
				this.blocking   = true;
				this.locked		= true;
				this.animFrame 	= 0;
			}
			/*Healing*/
			if (keys[82] && this.jumping==false && this.dodging==false){
				if (this.hasPotion==true){
					if (this.potionCharges>0){
						this.frame 		= 0;
						this.healing 	= true;
						this.locked 	= true;
						this.animFrame 	= 0;
					}
					else
					{
						if (this.healing==false)
		       				this.audioFail.play();
	       			}
				}
			}
			/*Jumping*/
			if (keys[32] || keys[87] && this.jumpExhaust==0){
				if (this.stamina>=5 && this.jumping==false){
					this.frame   		= 0;
					this.moving 		= true;
					this.walking    	= false;
					this.dodging 		= false;
					this.jumping 		= true;
					this.falling		= false;
					this.spawning		= false;
					this.animFrame		= 0;
					this.jumpExhaust	= 1;
					this.regen 			= 0;
					this.stamina 		-= 5;
		 			this.velY 			= -this.speed-5;  	
				}
				if (this.stamina<5){
					if (this.jumping==false)
		       			this.audioFail.play();
				}
			}
			/*Walking forward*/
	   		if (keys[68]){
				this.moving 	= true;
				this.walking    = true;
				this.dodging 	= false;
				this.falling	= false;
				this.spawning	= false;
				this.heading	= 1;
				this.regen 		= 0.1;

	   			if (this.velX<this.speed)
	   			{
	   				this.velX+=2;
	   			}
	       	}
	       	/*Walking backward*/
	   		if (keys[65]){
				this.moving 	= true;
				this.walking    = true;
				this.dodging 	= false;
				this.falling	= false;
				this.spawning	= false;
				this.heading	= -1;
				this.regen 		= 0.05;

	   			if (this.velX>-this.speed)
	   			{
	   				this.velX	-=2;
	   			}
	       	}
	       	/*Correct over-walking*/
	       	if (keys[65]==false && keys[68]==false && this.jumping==false && this.dodging==false){
	       		this.moving		= false;
				this.walking 	= false;
	       	}
	       	/*Dodge*/
	       	if (this.jumping==false){
	       		if (keys[86])
	       		{
	       			if (this.stamina >= 10){
	       				this.frame 		=0;
	       				this.moving 	= true;
						this.walking    = false;
						this.regen 		= 0;
						this.dodging 	= true;
						this.falling	= false;
						this.spawning	= false;
						this.locked		= true;
						this.animFrame 	= 0;
		   				this.iFrame 	= 0;
		   				this.stamina  	-= 10;
		   				this.collides   = false;
	       			}
	       			else
					{
						if (this.dodging==false)
		       				this.audioFail.play();
	       			}
	   			}
	       	}
		}
	}

	/*Isolated enemy collider (exists in update!)*/
	enemyCollide(entity,camera){
		if (this.collides==true && entity.collides==true){
			var check = this.checkCollision(entity);
			if (check==true){
				this.resolveCollision(entity);
			}

			if (this.attacking==true && this.animFrame==4 && this.hasAttacked==false){
				this.hasAttacked=false;
				var attackCheck = this.attackCollide(entity);
				if (attackCheck==true){
					this.hasHitEnemy=true;
					camera.shake(1);
					this.audioAttackHit[1].play();
					var damage = this.offense + this.weapon*10;
					if (this.heading==entity.heading){
						damage = this.offense + 10 + this.weapon*this.offense;
					}
					entity.recieveDamage(damage,this);
					this.hasAttacked=true;
				}
			}else{
				this.hasHitEnemy=false;
			}
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

	/*Attack Collision (hitbox extension)*/
	attackCollide(entity){
	    var l1 = this.getLeft();
	    var t1 = this.getTop();
	    var r1 = this.getRight();
	    var b1 = this.getBottom();
	     
	    var l2 = entity.getLeft()-3;
	    var t2 = entity.getTop()-3;
	    var r2 = entity.getRight()+3;
	    var b2 = entity.getBottom()+3;

	    b1-=10;
	    if (this.heading==1)
	    	{
	    		r1+=this.range;
	    		if (this.weapon==1){
	    			r1+=20;
	    			l1-=5;
	    		}
	    	}
	    else if (this.heading==-1)
	    	{
	    		l1-=this.range;
	    		if (this.weapon==1){
	    			r1+=5;
	    			l1-=20;
	    		}
	    	}

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

	/*Player stat updater*/
	updateStats(){
		if (this.yVar >=1 && this.jumping==false){
			this.falling    = true;
		}
		if (this.yVar<=0){
			this.falling=false;
		}
		if (this.blocking==true){
			this.regen=0;
		}
		if (this.score>=999999999){
			this.score = 999999999;
		}
		if (this.dodging==false){
			this.collides=true;
		}
		/*Jump lock control*/
		if (this.jumpExhaust!=0){
			this.jumpExhaust++;
		}
		if (this.jumpExhaust>40){
			this.jumpExhaust=0;
		}
		/*Stamina Regen*/
		if (this.stamina < this.maxStamina){
			this.stamina+=this.regen;
		}
		/*Stamina Ceiling*/
		if (this.stamina > this.maxStamina){
			this.stamina = this.maxStamina;
		}
		/*Stamina Floor*/
		if (this.stamina <= 0){
			this.stamina = 0;
		}
		/*Health Regen*/
		if (this.health < this.maxHealth){
			this.health += this.hpRegen*0.2;
		}
		/*Health Ceiling*/
		if (this.health > this.maxHealth){
			this.health = this.maxHealth;
		}
		/*Health Floor*/
		if (this.health <= 0){
			this.health = 0;
		}
		/*Potion decrementing*/
		if (this.healing==true && this.frame==48){
			this.potionCharges -= 1;
		}
		/*Control healing amount*/
		if (this.healing==true && this.animFrame==6){
			if (this.maxHealth - this.health < 1){
				this.health = this.maxHealth;
			}
			else{
				this.hpRegen=4;
			}
		}
	}

	/*Player state adjuster for update function*/
	adjustStates(){
		/*Handle dodge action locking*/
		if (this.dodging == true){	
			this.walking = false;
			if (this.iFrame==1){
				if (this.heading==1){
					this.velX	+=20;
				}
				else{
					this.velX	-=20;
				}
			}
			this.iFrame++;
			if (this.iFrame > 34){
				this.walking 	= false;
				this.velX		= 0;
			}
			if (this.iFrame > 36){
				this.animFrame 	= 0;
				this.iFrame 	= 0;
				this.locked 	= false;
				this.dodging 	= false;
			}
		}

		/*Value adjustments*/
		if (this.dodging==false && this.attacking==false){
			if (this.velY==0 && this.velX==0){
				this.regen 		= 0.2;
				this.moving 	= false;
				this.walking 	= false
			}
			if (this.velY == 0 && this.jumping==true){
				this.jumping 	= false;
			}
			if ((this.velX < 0.5) && (this.velX> -0.5))
				this.velX =0;
		}
	}

	/*Player update function for input followup*/
	update(mapWidth, mapHeight, gravity, friction, tileArray, enemyArray, bossArray, camera,level){
		if (this.dead==true){
			if (this.deadFrame>100){
				level.reloadLevel(this);
				this.deadFrame=0;
			}
		}else{
			this.drawRatio=0;
		}
		/*Debug stuff*/
		this.updateStats();
		this.adjustStates();
		if (this.dead==true)
			this.hpRegen=0;
		/*Update velocities*/
		if (this.dodging==false){
			this.velX *= friction;
		}
		else{
			this.velX *= 0.9;
		}
		this.velY += gravity;

		/*Update position*/
		var stepx = Math.floor(this.velX/1.5);
		var stepy = Math.floor(this.velY/2);

		this.lastYVar = this.yVar;
		this.x += stepx;
		this.yVar = (this.y+stepy)-this.y;
		this.y += stepy;


		for (var i=0; i<tileArray.length; i++){
			if(this.checkCollision(tileArray[i],i) == true)
				this.resolveCollision(tileArray[i]);
		}
		if (this.x>=mapWidth-this.width){
			this.x = mapWidth-this.width;
		}
		else if (this.x <= 0){
			this.x = 0;
		}
		if(this.y>=(mapHeight)-this.height){
			this.velY = 0;
			this.kill();
		}
	    if(this.y<= 0){
	    	this.y = 0;
	    }
	    for (var i=0; i<enemyArray.length; i++){
	    	this.enemyCollide(enemyArray[i],camera);
	    }
	    for (var i=0; i<bossArray.length; i++){
	    	this.enemyCollide(bossArray[i],camera);
	    }
	    
	    if (this.attacking==true && this.animFrame==7){
	    	this.hasHitEnemy=false;
	    	this.audioControl=0;
	    }
	}

	/*Render audio according to player state*/
	renderAudio(){
		if (this.healing==true && this.locked==true && this.frame==1*6){
			this.audioActionRuffle.play();
		}
		if (this.healing==true && this.locked==true && this.frame==4*6){
			this.audioItemPotion.play();
		}
		if (this.blocking==true && this.frame==0){
			this.audioActionRuffle.play();
		}
		/*Walking handling - Play audio on footdown*/
		if (this.walking==true && this.frame==4.5*4 && this.jumping==false && this.attacking==false){
			//play left foot
			var value = getRandomInt(0,2);
			this.audioActionFootLeft[value].play();
		}
		else if (this.walking==true && this.frame==9*4 && this.jumping==false && this.attacking==false){
			//play right foot
			var value = getRandomInt(0,3);
			this.audioActionFootRight[value].play();
		}
		/*Jumping handling - Play on jump*/
		if (this.jumping==true && this.animFrame==0 && this.frame<2){
			this.audioActionJumping.play();
		}
		/*Dodge handling - Play on dodge frame*/
		if (this.dodging==true && this.frame==2){
			this.audioActionRolling.play();
		}
		/*Landing handling - Play on landing*/
		if (this.yVar==0 && this.lastYVar>1){
			var volumeScale = this.lastYVar/10 -0.5;
			if (volumeScale>1){
				volumeScale=1;
			}
			if (volumeScale<0){
				volumeScale=0.1;
			}
			this.audioActionLanding.volume=volumeScale;
			this.audioActionLanding.play();
		}
		if (this.attacking==true 
			&& (this.frame==16) 
			&& this.hasHitEnemy==false){
			var value = getRandomInt(0,2);
			this.audioAttack[value].pause();
			this.audioAttack[value].currentTime = 0;
			this.audioAttack[value].play();
		}
		if (this.attacking==true && this.frame==17 && this.hasHitEnemy==true ){
			this.audioControl=1;
			var value = getRandomInt(0,2);
			this.audioAttackHit[value].pause();
			this.audioAttackHit[value].currentTime = 0;
			this.audioAttackHit[value].play();
		}
		if (this.hurt==true && this.frame==15){;
			var value = getRandomInt(1,4);
			this.audioHurtGrunt.volume=0.5;
			this.audioHurtGrunt[value].play();
			value = getRandomInt(0,2);
			this.audioDamageBlood.volume=0.2;
			this.audioDamageBlood[value].play();
		}
		if (this.hurt==true && this.blocking==true && this.frame==15){;
			var value = getRandomInt(1,4);
			this.audioHurtGrunt.volume=0.5;
			this.audioHurtGrunt[value].play();
			value = getRandomInt(0,2);
			this.audioDamageBlood.volume=0.2;
			this.audioDamageBlood[value].play();
		}
	}

	/*Complex player draw function*/
	draw(ctx){
		/*Coordinate snapping*/
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

		/*Debug*/

		/*Spawning check*/
		if (this.spawning==true){
			//Spawning animation
			//Framecounter++
			//if framecounter>animTime
				//this.spawning==false;
		}
		/*Weapon 0: Fists*/
		else if (this.weapon==0){
			/*Death check*/
			if (this.dead==true){
				if (this.heading==1 || this.heading==0)
				{
					ctx.globalAlpha=1-this.drawRatio*3;
					if (1-this.drawRatio*3<0){
						ctx.globalAlpha=0;
					}
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  8*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame>=6){
						this.animFrame=6;
					}
					ctx.globalAlpha=1;
					return;
				}
				else
				{
					ctx.globalAlpha=1-this.drawRatio*3;
					if (1-this.drawRatio*3<0){
						ctx.globalAlpha=0;
					}
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  8*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame>=6){
						this.animFrame=6;
					}
					ctx.globalAlpha=1;
					return;
				}	
			}
			/*Hurt case: All action is interrupted and hurt plays*/
			if (this.hurt == true){
				if (this.heading==1||this.heading==0)
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX,
										  7*this.offsetY,
										  68,60,
										  this.x-44, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==5){this.animFrame=0;this.locked=false;this.hurt=false;this.frame=0;}
				}
				else
				{	
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  7*this.offsetY+this.headOffset,
										  68,60,
										  this.x-6, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==5){this.animFrame=0;this.locked=false;this.hurt=false;this.frame=0;}
				}
			return;}
			
			/*Healing case: player heal overrides all others*/
			if (this.healing==true && this.locked==true){
				if (this.heading==1 || this.heading==0)
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  4*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==10){
						this.locked=false;
						this.hpRegen=0;
						this.frame=0;
						this.healing=false;
						this.animFrame=0;
					}
				}
				else
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  4*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==10){
						this.locked=false;
						this.hpRegen=0;
						this.frame=0;
						this.healing=false;
						this.animFrame=0;
					}
				}	
			return;}
			
			/*Base case: Not attacking or suffering damage*/
			if (this.hurt==false && this.attacking==false && this.blocking==false && this.healing==false){
				/*Idle - Sorted*/
				if (this.moving==false && this.jumping==false && this.locked==false
				&& this.dodging==false && this.falling==false && this.walking==false)
				{
						if (this.heading==1||this.heading==0)
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				return;}
				/*Jumping - Sorted*/
				else if (this.moving==true && this.jumping==true && this.locked==false
				&& this.dodging==false && this.falling==false && (this.walking==true || this.walking==false))
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  2*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%8==0){this.animFrame++;}
							if (this.animFrame>=3)
							{
								this.animFrame=3;
							}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  2*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%8==0){this.animFrame++;}
							if (this.animFrame>=3)
							{
								this.animFrame=3;
							}
						}
				}
				/*Walking - Sorted*/
				else if (this.moving==true && this.jumping==false && this.walking==true
				&& this.dodging==false && this.falling==false && this.locked==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  1*this.offsetY,
										  68,60,
										  this.x-22, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  1*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				}
				/*Falling*/
				else if ( this.falling==true && this.jumping==false && this.dodging==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  3*this.offsetX, 
										  2*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
	
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  3*this.offsetX, 
										  2*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
						}
				}
				/*Rolling - not Sorted*/
				else if (this.moving == true && this.jumping==false 
				&& this.dodging==true && this.walking==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  3*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  3*this.offsetY+this.headOffset,
										  68,60,
										 this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){
								this.animFrame++;
							}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				}
			}
		
			/*Lock idle case: Not doing anything except talking to NPC*/
			if (this.jumping==false && this.locked==true && this.blocking==false
				&& this.dodging==false && this.falling==false && this.attacking==false 
				&& this.healing==false)
				{
						if (this.heading==1||this.heading==0)
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%6==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%6==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
			return;}
			
			/*Block case: All actions interrupted, resets to idle*/
			if (this.hurt == false && this.attacking==false && this.blocking==true && this.healing==false){
					if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  0, 
										  6*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  0, 
										  6*this.offsetY+this.headOffset,
										  68,60,
										  this.x-32, this.y-10,
										  68,60);
							this.frame++;
						}
			return;}
			
			/*Attack case: All actions interrupted, resets to idle*/
			if (this.hurt == false && this.attacking==true && this.blocking==false && this.healing==false && this.locked == true){
					if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  5*this.offsetY,
										  68,60,
										  this.x-18, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;this.attacking=false;this.locked=false;this.hasAttacked=false;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  5*this.offsetY+this.headOffset,
										  68,60,
										  this.x-30, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;this.attacking=false;this.locked=false;this.hasAttacked=false;}
						}
			return;}
		}
		else if (this.weapon==1){
			/*Death check*/
			if (this.dead==true){
				if (this.heading==1 || this.heading==0)
				{
					ctx.globalAlpha=1-this.drawRatio*3;
					if (1-this.drawRatio*3<0){
						ctx.globalAlpha=0;
					}
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  8*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame>=6){
						this.animFrame=6;
					}
					ctx.globalAlpha=1;
					return;
				}
				else
				{
					ctx.globalAlpha=1-this.drawRatio*3;
					if (1-this.drawRatio*3<0){
						ctx.globalAlpha=0;
					}
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  8*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame>=6){
						this.animFrame=6;
					}
					ctx.globalAlpha=1;
					return;
				}	
			}
			/*Hurt case: All action is interrupted and hurt plays*/
			if (this.hurt == true){
				if (this.heading==1||this.heading==0)
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX,
										  7*this.offsetY,
										  68,60,
										  this.x-23, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==5){this.animFrame=0;this.locked=false;this.hurt=false;this.frame=0;}
				}
				else
				{	
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  7*this.offsetY+this.headOffset,
										  68,60,
										  this.x-18, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==5){this.animFrame=0;this.locked=false;this.hurt=false;this.frame=0;}
				}
			return;}
			
			/*Healing case: player heal overrides all others*/
			if (this.healing==true && this.locked==true){
				if (this.heading==1 || this.heading==0)
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  4*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==10){
						this.locked=false;
						this.hpRegen=0;
						this.frame=0;
						this.healing=false;
						this.animFrame=0;
					}
				}
				else
				{
					ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  4*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
					this.frame++;
					if (this.frame%6==0){this.animFrame++;}
					if (this.animFrame==10){
						this.locked=false;
						this.hpRegen=0;
						this.frame=0;
						this.healing=false;
						this.animFrame=0;
					}
				}	
			return;}
			
			/*Base case: Not attacking or suffering damage*/
			if (this.hurt==false && this.attacking==false && this.blocking==false && this.healing==false){
				/*Idle - Sorted*/
				if (this.moving==false && this.jumping==false && this.locked==false
				&& this.dodging==false && this.falling==false && this.walking==false)
				{
						if (this.heading==1||this.heading==0)
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				return;}
				/*Jumping - Sorted*/
				else if (this.moving==true && this.jumping==true && this.locked==false
				&& this.dodging==false && this.falling==false && (this.walking==true || this.walking==false))
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  2*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%8==0){this.animFrame++;}
							if (this.animFrame>=3)
							{
								this.animFrame=3;
							}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  2*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%8==0){this.animFrame++;}
							if (this.animFrame>=3)
							{
								this.animFrame=3;
							}
						}
				}
				/*Walking - Sorted*/
				else if (this.moving==true && this.jumping==false && this.walking==true
				&& this.dodging==false && this.falling==false && this.locked==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  1*this.offsetY,
										  68,60,
										  this.x-22, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  1*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				}
				/*Falling*/
				else if ( this.falling==true && this.jumping==false && this.dodging==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  3*this.offsetX, 
										  2*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
	
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  3*this.offsetX, 
										  2*this.offsetY+this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
						}
				}
				/*Rolling - not Sorted*/
				else if (this.moving == true && this.jumping==false 
				&& this.dodging==true && this.walking==false)
				{
						if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  3*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  3*this.offsetY+this.headOffset,
										  68,60,
										 this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%4==0){
								this.animFrame++;
							}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
				}
			}
		
			/*Lock idle case: Not doing anything except talking to NPC*/
			if (this.jumping==false && this.locked==true && this.blocking==false
				&& this.dodging==false && this.falling==false && this.attacking==false 
				&& this.healing==false)
				{
						if (this.heading==1||this.heading==0)
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%6==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
						else
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*this.offsetX, 
										  0*this.offsetY + this.headOffset,
										  68,60,
										  this.x-24, this.y-10,
										  68,60);
							this.frame++;
							if (this.frame%6==0){this.animFrame++;}
							if (this.animFrame==10){this.animFrame=0;this.frame=0;}
						}
			return;}
			
			/*Block case: All actions interrupted, resets to idle*/
			if (this.hurt == false && this.attacking==false && this.blocking==true && this.healing==false){
					if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  0, 
										  6*this.offsetY,
										  68,60,
										  this.x-9, this.y-10,
										  68,60);
							this.frame++;
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  0, 
										  6*this.offsetY+this.headOffset,
										  68,60,
										  this.x-32, this.y-10,
										  68,60);
							this.frame++;
						}
			return;}
			
			/*Attack case: All actions interrupted, resets to idle*/
			if (this.hurt == false && this.attacking==true && this.blocking==false && this.healing==false && this.locked == true){
					if (this.heading==1||this.heading==0)
						{
							ctx.drawImage(this.sprite, 
										  this.animFrame*143, 
										  5*this.offsetY,
										  143,60,
										  this.x-65, this.y-10,
										  143,60);
							this.frame++;
							if (this.frame%3==0){this.animFrame++;}
							if (this.animFrame==9){this.animFrame=0;this.frame=0;this.attacking=false;this.locked=false;this.hasAttacked=false;}
						}
						else
						{	
							ctx.drawImage(this.sprite, 
										  this.animFrame*143, 
										  5*this.offsetY+this.headOffset,
										  143,60,
										  this.x-50, this.y-10,
										  143,60);
							this.frame++;
							if (this.frame%3==0){this.animFrame++;}
							if (this.animFrame==9){this.animFrame=0;this.frame=0;this.attacking=false;this.locked=false;this.hasAttacked=false;}
						}
			return;}
		}
	}

	/*Clear function for debugging*/
	clear(ctx){
		//Auxiliary clearing function
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}	

	/*Draw all player info for debug*/
	drawDebugInfo(ctx){
		ctx.globalAlpha=0.2;
		ctx.fillStyle="red";
		if (this.attacking==true && this.animFrame>4){
			if (this.weapon==0){
				if (this.heading==1)
					ctx.fillRect(this.x+this.width, this.y, this.range,this.height);
				else if (this.heading==-1)
					ctx.fillRect(this.x-this.range, this.y, this.range,this.height);
			}
			if (this.weapon==1){
				if (this.heading==1)
					ctx.fillRect(this.x+this.width, this.y, this.range+20,this.height);
				else if (this.heading==-1)
					ctx.fillRect(this.x-this.range-20, this.y, this.range,this.height);
			}
		}
		ctx.fillStyle="white";
		ctx.globalAlpha=1;
		ctx.fillStyle="white";
		ctx.fillText("PLAYER DATA", this.x-10, this.y-50);
		ctx.fillStyle="red";
		ctx.fillText("x: "+this.x, this.x-10, this.y-40);
		ctx.fillText("Vx: "+Math.round(this.velX), this.x-10, this.y-30);
		ctx.fillStyle="yellow";
		ctx.fillText("hp : "+ Math.floor(this.health),this.x-10,this.y-20);
		ctx.fillText("stm:" + Math.floor(this.stamina),this.x-10,this.y-10);
		ctx.fillStyle="green";
		ctx.fillText("y: "+this.y, this.x+33, this.y-40);
		ctx.fillText("Vy: "+Math.round(this.velY), this.x+33, this.y-30);
		ctx.fillStyle="purple";
		ctx.fillText("hed: "+this.heading, this.x+33, this.y-20);
		ctx.fillText("mov: "+this.moving, this.x+33, this.y-10);
		ctx.fillText("wlk : "+this.walking, this.x+33, this.y-0);
		ctx.fillText("ddg: "+this.dodging, this.x+33, this.y+10);
		ctx.fillText("jmp: "+this.jumping, this.x+33, this.y+20);
		ctx.fillStyle="red";
		ctx.fillText("lok : "+this.locked, this.x+33, this.y+30);
		ctx.fillText("atk : "+this.attacking, this.x+33, this.y+40);
		ctx.fillText("blk : "+this.blocking, this.x+33, this.y+50);
		ctx.fillText("HEAL: "+this.healing, this.x+33, this.y+60);
		ctx.fillText("HURT: "+this.hurt, this.x+33, this.y+70);
	}

	/*Sink for score*/
	recieveScore(score){

		this.score+=score;
	}

	/*Sink for damage*/
	recieveDamage(damage,enemyDirection){
		if (this.blocking==false){

			this.health -= damage;
		} 
		else if (this.blocking==true && this.stamina>0){
			if (this.stamina>10){
				this.health -= damage/4;
				this.stamina -= 10;
			}else{
				this.stamina=0;
				this.health -= damage*2;
				if (this.health<=0){
					this.deadFrame=0;
					this.kill();
				}else{
					this.hurt=true;
					this.attacking=false;
					this.animFrame=0
					this.frame=0;
					this.locked=true;
				}
			}
			return;
		}


		

		if (this.health<=0){
			this.kill();
		}else{
			this.hurt=true;
			this.attacking	= false;
			this.blocking   = false;
			this.moving 	= false;
			this.walking    = false;
			this.dodging 	= false;
			this.hpRegen=0;
			this.jumping 	= false;
			this.falling	= false;
			this.spawning	= false;
			this.healing 	= false;
			this.collides	= true;
			this.hasHitEnemy= false;
			this.hasAttacked= false;
			this.attacking=false;
			this.animFrame=0
			this.frame=0;
			this.locked=true;
		}
	}

	/*Kill function*/
	kill(){
		this.health=0;
		this.hpRegen=0;
		this.animFrame=0;
		this.dead=true;
		this.audioHurtDeath.play();
		this.audioBlood.play();
		this.deadFrame=0;
	}

	/*Draw death screen*/
	drawDeathScreen(ctx){
		if (this.shouldDrawDeath==false){
			return;
		}
		this.drawRatio+=0.005;
		if (this.drawRatio>0.5){
			this.drawRatio=1;
			this.audioUIDead.play();
			ctx.fillStyle="black";
			ctx.fillRect(0,0,640,360);
			this.deadFrame++;
		}
		
		ctx.globalAlpha=this.drawRatio;
		ctx.drawImage(this.deathScreen,0,0);
		ctx.globalAlpha=1;
	}
	drawWinScreen(ctx){
		if (this.shouldDrawWin==false){
			return;
		}
		if (this.isDrawn==true)
			this.winFrame++;
		if (this.winFrame>200 && this.isDrawn==true){
			this.drawWinRatio-=0.01;
			if (this.drawWinRatio<=0){
				this.drawWinRatio=0;
				this.shouldDrawWin=false;
			}
		}
		if (this.isDrawn==false){
			this.audioVictory.loop = false;
			this.audioVictory.play();
			this.drawWinRatio+=0.01;
		}
		if (this.drawWinRatio>0.5 && this.isDrawn==false){
			this.drawWinRatio=1;
			this.isDrawn=true;
		}
		ctx.globalAlpha=this.drawWinRatio;
		ctx.drawImage(this.winScreen,0,0);
		ctx.globalAlpha=1;
	}

}
//pMARTYR_0.1 Player.js ECMAscript Class
//Description:Player character class
