function isCharDigit(n){return !!n.trim() && n*0==0;}

class Interactable{
	
	/*Simple constructor for interactable class*/
	constructor(centerX,centerY,buttons){
		/*Local Attributes (hardcoded)*/
		this.centerX 	= centerX;
		this.centerY 	= centerY;
		this.x 			= centerX - 300/2; 
		this.y 			= centerY - 300/2;
		this.inner		= 300/4;
		this.width 		= 300;
		this.height 	= 300;
		this.hOffset    = 0;
		this.vOffset    = 0;

		/*Hotkey Sprites*/
		this.buttons    = buttons;

		/*Behaviour controls*/
		this.inArea 	= false;
		this.triggered  = false;
		this.ratio      = 1;
		this.bob		= 0;
		this.bobFrame   = 0;
		this.percent    = undefined;
	}

	/*Update based on player and keys*/
	updateInteractable(player,keys){
		if (player.x+player.width/2 > this.x && player.x+player.width/2 < this.x+this.width){
			this.inArea=true;
			this.percent = 1-Math.abs((((player.x+player.width/2)-this.centerX)*100)/this.width)/100;
			if (this.percent>=(3/4)){
				this.ratio=1;
				if (keys[69]){
					this.triggered=true;

				}else{
					this.triggered=false;
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

	/*Draw a floating hotkey prompt (it changes!)*/
	drawPrompt(ctx){
		var x = this.centerX-this.hOffset;
		var y = this.centerY-this.vOffset;
		if (this.inArea==true){
			if (this.triggered==false){
				this.bobFrame++;
				if (this.bobFrame<=16)
					this.bob+=0.1;
				if (this.bobFrame>16 && this.bobFrame <= 48)
					this.bob-=0.1;
				if (this.bobFrame>48 && this.bobFrame<=64)
					this.bob+=0.1;
				if (this.bobFrame>=64)
				{
					this.bobFrame=0;
					this.bob=0;
				}
			}
			ctx.globalAlpha=this.ratio;
			if (this.triggered==false)
				this.drawHotKey(ctx, x, Math.round(y+this.bob), "e", false);
			else
				this.drawHotKey(ctx, x, Math.round(y+this.bob), "e", true);
			ctx.globalAlpha=1;
		}
	}

	/*Parametrized hotkey function*/
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

	/*Draw the interaction area*/
	drawArea(ctx){
		ctx.globalAlpha=0.5;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillRect(this.x+this.inner,this.y,this.width-this.inner*2,this.height);
		ctx.globalAlpha=1;
	}
}
//pMARTYR_0.8 ECMAscript Class
//Description: