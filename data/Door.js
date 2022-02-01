function isCharDigit(n){return !!n.trim() && n*0==0;}

class Door extends Interactable{

	/*Superconstructor plus door features*/
	constructor(centerX,centerY,w,h){
		/*Local Attributes (hardcoded)*/
		super(centerX,centerY)
		this.centerX		= centerX;
		this.centerY		= centerY;
		this.x 				= centerX - 150/2; 
		
		this.inner			= 150/4;
		this.width 			= 150;
		this.hOffset        = 20;

		this.doorWidth		= w;
		this.y 				= this.centerY - h/2;
		this.height 		= h;
		this.doorEntity     = new Entity(this.centerX,this.y,this.doorWidth/4,h);

		/*Door specific stuff*/
		this.doorSprite		= undefined;
		this.doorHeight		= this.height;
		this.opening        = false;
		this.opened 		= false;
		this.frame          = 0;
		this.locked 		= false;
		this.animFrame      = 0;
	}

	loadDoor(type,level){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=2;
			this.type=type;
			this.doorSprite		= new Image();
			this.doorSprite.addEventListener("load", imgLoadedHandler);
			this.doorSprite.src 		= "assets/level_"+level+"/env_door"+type+".png";
			this.buttons 				= new Image();
			this.buttons.addEventListener("load", imgLoadedHandler);
			this.buttons.src    		= "assets/ui/ui_buttons.png";
			this.audioOpen = new Audio();
			this.audioOpen.addEventListener("load",imgLoadedHandler);
			this.audioOpen.src = "assets/audio/door/door_"+type+".ogg";
			if (this.type=="Iron"){
				this.audioOpen.volume=0.3;
			}
			function imgLoadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}

	tryUnlock(boss){
		if (boss.dead==true){
			this.locked=false;
		}
	}

	/*Overriding normal update for door features*/
	updateInteractable(player,keys){
		if (this.opened==false){
			if(player.checkCollision(this.doorEntity)==true){
				player.resolveCollision(this.doorEntity);
			}
		}
		if (this.opened==true){
			return;
		}
		if (this.opening==true){
			this.frame++;
			if (this.type=="Cell"){
				if (this.frame%8==0){
				this.animFrame++;
				}
				if (this.animFrame>=4){
					this.animFrame=4;
					this.opened=true;
					this.opening=false;
					this.triggered=false;
				}
			}else if (this.type=="Iron"){
				if (this.frame%24==0){
					this.animFrame++;
				}
				if (this.animFrame>=6){
					this.animFrame=5;
					this.opened=true;
					this.opening=false;
					this.triggered=false;
				}
			}else if (this.type=="IronAlt"){
				if (this.frame%24==0){
					this.animFrame++;
				}
				if (this.animFrame>=6){
					this.animFrame=5;
					this.opened=true;
					this.opening=false;
					this.triggered=false;
				}
			}
			
		}
		if (this.locked==true){
			return;
		}
		if (player.x+player.width/2 > this.x && player.x+player.width/2 < this.x+this.width){
			this.inArea=true;
			this.percent = 1-Math.abs((((player.x+player.width/2)-this.centerX)*100)/this.width)/100;
			if (this.percent>=(3/4)){
				this.ratio=1;
				if (keys[69]){
					this.triggered = true;
					this.opening   = true;
					this.audioOpen.play();
				}else{
					this.triggered = false;
				}
			}
			else{

				this.ratio = (this.percent-0.5)*4;
			}
		}
		else{
			this.inArea=false;
		}
	}
	
	/*Draw order with prompt while closed*/
	draw(ctx){
		 if (this.type=="IronAlt"){
		 	if (this.animFrame==0){
		 		ctx.drawImage(this.doorSprite, 
						this.animFrame*this.doorWidth,
						0,this.doorWidth,this.doorHeight, 
						this.centerX,this.y, 
						this.doorWidth,this.doorHeight);
		 	}else{
		 		ctx.drawImage(this.doorSprite, 
						this.animFrame*this.doorWidth,
						0,this.doorWidth,this.doorHeight, 
						this.centerX+13,this.y, 
						this.doorWidth,this.doorHeight);
		 	}
		 }
		else
		{
			ctx.drawImage(this.doorSprite, 
						this.animFrame*this.doorWidth,
						0,this.doorWidth,this.doorHeight, 
						this.centerX+this.animFrame,this.y, 
						this.doorWidth,this.doorHeight);
		}
		
		if (this.triggered==false && this.opened==false && this.opening==false){
			if (this.locked==true)
				return;			
			this.drawPrompt(ctx);
		}
	}
}
//pMARTYR_0.8 ECMAscript Class
//Description: