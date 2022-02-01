function lerp (start,end,amt){return (1-amt)*start+amt*end}
function isCharDigit(n){return !!n.trim() && n*0==0;}

class HUD{
	constructor(w,h){
		/*Define the position for it as 90% of the canvas*/
		this.width 	 	= w;
		this.height  	= h;
		this.x 		 	= Math.floor(this.width*0.1);
		this.y 		 	= Math.floor(this.height*0.1);

		this.backdrop	= undefined;
		this.barSprite  = undefined;
		this.overlay	= undefined;
		this.numbers 	= undefined;
		this.flask		= undefined;
		this.environ    = undefined;
		this.buttons    = undefined;
		this.levels     = undefined;
		this.numModular = undefined;
		this.playerHeal = false;
		this.healRatio  = 0;
		this.scoreRatio = 0;

		this.lastScore  = 0;
		this.incrementScore = 0;

		this.ratio=1;
		this.fadeout    = false;
		this.fadein     = false;
		this.frame		   = 0;
	}

	loadHUD(){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=11;
			this.backdrop 			= new Image();	
			this.backdrop.addEventListener("load",imgLoadedHandler);
			this.barSprite 		= new Image();	
			this.barSprite.addEventListener("load",imgLoadedHandler);
			this.overlay 	= new Image();	
			this.overlay.addEventListener("load",imgLoadedHandler);
			this.numbers 	= new Image();	
			this.numbers.addEventListener("load",imgLoadedHandler);
			this.numModular 	= new Image();	
			this.numModular.addEventListener("load",imgLoadedHandler);
			this.environ 	= new Image();	
			this.environ.addEventListener("load", imgLoadedHandler);
			this.flask  	= new Image();	
			this.flask.addEventListener("load",  imgLoadedHandler);
			this.buttons 	= new Image();	
			this.buttons.addEventListener("load", imgLoadedHandler);
			this.levels    = new Image();
			this.levels.addEventListener("load", imgLoadedHandler);
			this.flash = new Image();
			this.flash.addEventListener("load", imgLoadedHandler);
			this.weapon = new Image();
			this.weapon.addEventListener("load", imgLoadedHandler);
			this.backdrop.src 		= "assets/ui/ui.png";
			this.barSprite.src 		= "assets/ui/ui_bars.png";
			this.overlay.src 		= "assets/ui/ui_overlay.png"
			this.numbers.src 		= "assets/ui/ui_numbers.png";
			this.numModular.src 	= "assets/ui/ui_numbersModular.png";
			this.environ.src 		= "assets/ui/ui_environ.png";
			this.flask.src  		= "assets/ui/ui_flask.png";
			this.buttons.src 		= "assets/ui/ui_buttons.png";
			this.levels.src         = "assets/ui/ui_levels.png";
			this.flash.src 			= "assets/ui/ui_flash.png";
			this.weapon.src         = "assets/ui/ui_weapon1.png"
			function imgLoadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
		
	}
	draw(ctx,player){
		ctx.clearRect(0,0,this.width,this.height);
		this.drawEnviron(ctx,player);
		ctx.globalAlpha=this.ratio;
		this.drawHUD(ctx,player);
		ctx.globalAlpha=1;
	}

	drawHUD(ctx,player){
		if (this.fadeout==true){
			if (this.ratio>0){
				this.ratio-=0.1;
			}else{
				this.ratio=0;
				this.fadeout=false;
			}
			ctx.globalAlpha=this.ratio;
		}
		if (this.fadein==true){
			if (this.ratio<1){
				this.ratio+=0.1;
			}else{
				this.ratio=1;
				this.fadein=false;
			}
			ctx.globalAlpha=this.ratio;
		}
		this.drawComponents(ctx,player);
		this.drawScore(ctx,640/2+273,360-34,player.score);
	}

	drawComponents(ctx,player){
		ctx.drawImage(this.backdrop, 0,0, this.width, this.height);
		/*Health Bars*/
		if (player.health > 0){
			ctx.drawImage(this.barSprite,
					  500-player.health*2,0,player.health*2-1,10,
					  80,26,player.health*2+1,10)
		}
		if (player.stamina > 0){
			ctx.drawImage(this.barSprite,
				      500-player.stamina*2,10,player.stamina*2,10,
					  80,26+16,player.stamina*2,10)
		}
		/*Flask*/
		if (player.hasPotion==true){
			ctx.drawImage(this.flask,
				player.potionCharges*38,0,38,38,
				32,304,38,38);
			/*Flask Amount*/
			ctx.drawImage(this.numbers,
		      	24*player.potionCharges,0,24,24,
		       	52,295,24,24);
			/*Flask Hotkey*/
			if (player.healing==false){
				this.drawHotKey(ctx,42,340,"r",false);
			}else{
				this.drawHotKey(ctx,42,340,"r",true);
			}
		}
		/*Weapon*/
		if (player.weapon==1){
			ctx.drawImage(this.weapon,
				0,0,38,38,
				32+32+11,303,38,38);
		}
		
		/*UI Overlay*/
		ctx.drawImage(this.overlay,0,0,this.width,this.height);
		ctx.drawImage(this.levels,(player.level-1)*43,0,43,43,35,18,43,43);
	}

	drawEnviron(ctx){

		ctx.drawImage(this.environ, 0,0, this.width, this.height);
	}

	drawHotKey(ctx,x,y,letter,pressed){
		/*Letter case - Index holds position for yOffset = 0*16*/
		if (letter.length==1 && isCharDigit(letter)==false){
			var keycode = letter.charCodeAt(0);
			var index = (keycode%32)-1;
			/*Letter*/
			if (index>=0 && index<=25){
				if (pressed==false){
					ctx.drawImage(this.buttons,index*16,0*16,16,16,x,y,16,16);
				}else{
					ctx.drawImage(this.buttons,index*16,4*16,16,16,x,y,16,16);
				}
				
			}
			/*Space*/
			if (index==-1){
				if (pressed==false){
					ctx.drawImage(this.buttons,0,3*16,80,16,x,y,80,16);
				}else{
					ctx.drawImage(this.buttons,0,(3+4)*16,80,16,x,y,80,16);
				}
			}
		}
		/*Number Case - Index holds position for yOffset = 1*16*/
		else if (isCharDigit(letter)){
			var index = parseInt(letter);
			
			if (pressed==false){
				ctx.drawImage(this.buttons,index*16,1*16,16,16,x,y,16,16);
			}else{
				ctx.drawImage(this.buttons,index*16,(1+4)*16,16,16,x,y,16,16);
			}

		}
		/*Special Case - No index, hardcoded representation*/
		else{
			if (letter=="esc"){
				if (pressed==false){
					ctx.drawImage(this.buttons,122,3*16,21,16,x,y,21,16);
				}else{
					ctx.drawImage(this.buttons,122,(3+4)*16,21,16,x,y,21,16);
				}
			}
			else if (letter=="enter"){
				if (pressed==false){
					ctx.drawImage(this.buttons,80,3*16,42,16,x,y,42,16);
				}else{
					ctx.drawImage(this.buttons,80,(3+4)*16,42,16,x,y,42,16);
				}
			}
			else if (letter=="up"){
				if (pressed==false){
					ctx.drawImage(this.buttons,0,3*16,16,16,x,y,16,16);
				}else{
					ctx.drawImage(this.buttons,0,(3+4)*16,16,16,x,y,16,16);
				}
			}
			else if (letter=="down"){
				if (pressed==false){
					ctx.drawImage(this.buttons,32,3*16,16,16,x,y,16,16);
				}else{
					ctx.drawImage(this.buttons,32,(3+4)*16,16,16,x,y,16,16);
				}
			}
			else if (letter=="right"){
				if (pressed==false){
					ctx.drawImage(this.buttons,48,3*16,16,16,x,y,16,16);
				}else{
					ctx.drawImage(this.buttons,48,(3+4)*16,16,16,x,y,16,16);
				}
			}
			else if (letter=="left"){
				if (pressed==false){
					ctx.drawImage(this.buttons,16,3*16,16,16,x,y,16,16);
				}else{
					ctx.drawImage(this.buttons,16,(3+4)*16,16,16,x,y,16,16);
				}
			}
		}
	}	

	drawScore(ctx,x,y,score){
		var number = this.incrementScore;
		this.number+=5;
		this.incrementScore+=5;
		if (number>score){
			number=score;
			this.incrementScore=number;
		}
       	var numArray = new Array();
       	if (number<10){
       		this.drawModularNumber(ctx,x,y,number);
       	}
       	else{
       		for(var i=0; number>0; i++){
	            numArray[i]= Math.floor(number%10);
	            number = Math.floor(number/10);
	            this.drawModularNumber(ctx,x-i*11,y,numArray[i]);
       		}
       	}
       	this.lastScore=this.incrementScore;
	}

	drawModularNumber(ctx,x,y,number){
		
		ctx.drawImage(this.numModular,number*15,0,15,18,x,y,15,18);
	}
}
//pMARTYR_0.8 ECMAscript Class
//Description: