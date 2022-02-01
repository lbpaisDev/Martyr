function isCharDigit(n){return !!n.trim() && n*0==0;}

class Actor extends Interactable{

	/*Superconstructor plus Actor features*/
	constructor(actorName,centerX,centerY,w,h){
		/*Local Attributes (hardcoded)*/
		/*Maybe fix this??*/
		var buttons 	= new Image();	
		buttons.src 		= "assets/ui/ui.png";
		super(centerX,centerY,buttons)
		this.centerX		= centerX;
		this.centerY		= centerY;
		this.inner			= 200/8;
		this.width 			= 200;
		this.height 		= 500;
		this.x 				= centerX - 200/2; 
		this.y 				= centerY - 500/2;
		this.hOffset		= 7;
		this.vOffset		= 50;
		this.actorName      = actorName;

		/*Actor specific stuff*/
		this.actorSprite		= undefined;
		this.dialogSprite		= undefined;
		this.actorWidth			= w;
		this.actorHeight		= h;
		this.talking        	= false;
		this.talked				= false;
		this.frame          	= 0;
		this.dframe             = 0;
		
		this.dialogTimeout  		= 0;
		this.dialogFrame    		= 0;
		this.dialogFrameDuration 	= 100;
		this.dialogOver				= false;
		this.animFrame      		= 0;
		this.dialogWait				= 0;

		this.dialogRatio 			= 1;
	}

	loadActor(actorName,level){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var fix = new Image();
			this.type = actorName;
			fix.src = "assets/level_"+level+"/npc_"+actorName+".png";
			var maxLoad=3;
			this.actorSprite 			= new Image();
			this.actorSprite.addEventListener("load", imgLoadedHandler);
			this.dialogSprite 			= new Image();
			this.dialogSprite.addEventListener("load", imgLoadedHandler);
			this.buttons 				= new Image();
			this.buttons.addEventListener("load", imgLoadedHandler);
			this.dialogAudio = new Audio();
			this.dialogAudio.src = "assets/audio/ui/ui_dialogue.ogg";
			this.actorSprite.src		= "assets/level_"+level+"/npc_"+actorName+".png";
			this.dialogSprite.src 		= "assets/level_"+level+"/npc_"+actorName+"_dialogue.png";
			this.buttons.src    		= "assets/ui/ui_buttons.png";
			function imgLoadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}

	/*Overriding normal update for actor features*/
	updateInteractable(player,keys,camera,hud,textBox){
		/*NPC Dialogue handling*/
		if (this.talking == true && this.talked == false){
			this.dialogWait++;
			player.locked=true;
			player.moving=false;
			player.jumping=false;
			player.blocking=false;
			player.dodging=false;
			player.falling=false;
			player.attacking=false;
			player.walking=false;
			player.healing=false;
			if (this.dialogWait>=4){
				this.dialogRatio=1;
			}
			if (keys[69] && this.dialogWait>10){
				this.dialogRatio-=0.25;
				this.dialogWait=0;
				this.dialogFrame++;
			}
			if (this.dialogWait>0 && this.dialogWait<3){
				this.dialogRatio-=0.25;
				if (this.dialogRatio<0){
					this.dialogRatio=0;
				}
			}

			/*Center camera on actor*/
			camera.bindActor(this);

			if (this.dialogFrame == 10){
				player.locked=false;
				camera.unbindActor(this);
				

				this.dialogFrame=0;
				this.dialogTimeout++;
				this.triggered=false;
				this.talked=true;
				this.talking=false;
				hud.fadein=true;

				textBox.autoStart();
				if (this.actorName=="sittingKnight"){
					player.weapon=1;
					player.reloadPlayer();
				}
				if (this.actorName=="holyPriest"){
					//player.potionCharges=4;
					//player.maxPotions=4;
					player.hasPotion=true;
					player.reloadPlayer();
				}

				
			}
		}
		if (this.talking == true && this.talked == true){
			this.dialogWait++;
			player.locked=true;
			if (keys[69] && this.dialogWait>20){
				this.dialogWait=0;
				this.dialogFrame++;
			}
			/*Center camera on actor*/
			camera.bindActor(this);

			if (this.dialogFrame == 1){
				player.locked=false;
				camera.unbindActor(this);
				this.dialogFrame=0;
				this.dialogTimeout++;
				this.triggered=false;
				this.talked=true;
				this.talking=false;
				hud.fadein=true;	
			}
		}
		/*Lockout for subsequent dialogues*/
		if (this.dialogTimeout!=0){
			/*Use this to prevent rapid reinteraction*/
			this.dialogTimeout++;
		}
		/*Standard interactable behaviour, modified slightly*/
		if (player.x+player.width/2 > this.x && player.x+player.width/2 < this.x+this.width){
			this.inArea=true;
			this.percent = 1-Math.abs((((player.x+player.width/2)-this.centerX)*100)/this.width)/100;
			if (this.percent>=(5/8)){
				this.ratio=1;
				/*To start the initial dialog, keys must be verified and there mustn't have 
				been a previous dialogue for a while (that's what dialogTimeout is for*/
				if (keys[69] && (this.dialogTimeout==0 || this.dialogTimeout>=100)){
					this.triggered		= true;
					this.dialogAudio.pause();
					this.dialogAudio.play();
					this.talking 		= true;
					hud.fadeout			= true;
					this.dialogTimeout	= 0;
					this.dialogRatio    = 0.5;
				/*Handle skipping for the dialog*/
				}else{
					this.triggered	= false;
				}
			}
			else{
				this.ratio = (this.percent-0.5)*4;
			}
		}
		else
			this.inArea	= false;
	}

	drawActor(ctx){
		this.frame++;
		
		if (this.type="holyPriest"){
			if (this.frame%16==0){
			this.animFrame++;
		}
		}else{
			if (this.frame%6==0){
			this.animFrame++;
		}
		}
		if (this.animFrame>=10){
				this.animFrame=0;
			}
		ctx.drawImage(this.actorSprite,
					  0+this.animFrame*this.actorWidth,
					  0,this.actorWidth, this.actorHeight,
					  this.centerX-this.actorWidth/2, this.centerY-this.actorHeight/2, this.actorWidth, this.actorHeight);
		if (this.talking==false && (this.dialogTimeout==0 || this.dialogTimeout>100)){
			ctx.fillStyle="white";
			this.drawPrompt(ctx);
		}
	}

	drawDialogue(ctx,keys){
		if (this.talking==true && this.talked==false){
			ctx.globalAlpha=this.dialogRatio;
			ctx.drawImage(this.dialogSprite,0,this.dialogFrame*90,640,90,0,360-90,640,90);
			ctx.globalAlpha=1;
			if (keys[69]==false){
				this.drawHotKey(ctx,640-60,360-22,"e",false);
				ctx.drawImage(this.dialogSprite,
				0,11*90,
				640,90,
				640-50-290,
				360-25,
				640,90);

			}else{
				this.drawHotKey(ctx,640-60,360-22,"e",true);
				ctx.globalAlpha=0.5;
				ctx.drawImage(this.dialogSprite,
				0,11*90,
				640,90,
				640-50-290,
				360-25,
				640,90);
				ctx.globalAlpha=1;
			}	
		}
		else if(this.talking==true && this.talked==true) {
			ctx.drawImage(this.dialogSprite,0,10*90,640,90,0,360-90,640,90);
			if (keys[69]==false){
				this.drawHotKey(ctx,640-60,360-22,"e",false);
				ctx.drawImage(this.dialogSprite,
				0,11*90,
				640,90,
				640-50-290,
				360-25,
				640,90);

			}else{
				this.drawHotKey(ctx,640-60,360-22,"e",true);
				ctx.globalAlpha=0.5;
				ctx.drawImage(this.dialogSprite,
				0,11*90,
				640,90,
				640-50-290,
				360-25,
				640,90);
				ctx.globalAlpha=1;
			}	
		}
	}
}
//pMARTYR_0.8 ECMAscript Class
//Description: