function isCharDigit(n){return !!n.trim() && n*0==0;}

class Interactible{
	constructor(centerX,centerY,w,h,buttons){
		this.centerX 	= centerX;
		this.centerY 	= centerY;
		this.x 			= centerX - w/2; 
		this.y 			= centerY - h/2;
		this.inner		= 50;
		this.width 		= w;
		this.height 	= h;
		this.buttons    = buttons;
		this.triggered  = false;
		this.ratio      = 1;
		this.bob		= 0;
		this.bobFrame   = 0;
		this.distance   = undefined;
	}
	updateInteractible(player){
		if (player.x > this.x && player.x < this.x+this.width){
			this.triggered=true;
			this.distance = Math.abs(this.centerX - player.x);
			if (this.distance<this.inner){
				this.ratio=1;
			}else{
				this.ratio = 1-Math.floor((this.distance-50)/10)/10;
			}
		}
		else{
			this.triggered=false;
		}
	}
	draw(ctx){
		if (this.triggered==true){
			this.bobFrame++;
			if (this.bobFrame<=16){
				this.bob+=0.1;
			}
			if (this.bobFrame>16 && this.bobFrame <= 48){
				this.bob-=0.1;
			}
			if (this.bobFrame>48 && this.bobFrame<=64){
				this.bob+=0.1;
			}
			if (this.bobFrame>=64){
				this.bobFrame=0;
				this.bob=0;
			}
			ctx.globalAlpha=this.ratio;
			this.drawHotKey(ctx,Math.floor(this.centerX-7), Math.floor(this.centerY-8+this.bob), "e", false);
			ctx.globalAlpha=1;
		}
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
}