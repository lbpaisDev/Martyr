class LevelDoor extends Interactable{
	constructor(x,y){
		var buttons 		= new Image();	
		buttons.src 		= "assets/ui/ui_buttons.png";
		super(x,y,buttons);
		this.centerX		= x;
		this.triggered=false;
		this.centerY		= y-96;
		this.exitOut=false;
	}
	updateInteractable(player,keys){
		if (player.x+player.width/2 > this.x && player.x+player.width/2 < this.x+this.width)
		{
			this.inArea=true;
			this.percent = 1-Math.abs((((player.x+player.width/2)-this.centerX)*100)/this.width)/100;
			if (this.percent>=(3/4))
			{
				this.ratio=1;
				if (keys[69])
				{
					this.triggered=true;
				}
			}
			else
			{
				this.ratio = (this.percent-0.5)*4;
			}
		}
		else
		{
			this.inArea=false;
		}
	}

	/*Draw order with prompt while closed*/
	drawDoor(ctx){
		if (this.triggered==false){			
			this.drawPrompt(ctx);
		}
		else{			
			this.drawPrompt(ctx);
		}
	}
}