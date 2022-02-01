class TextBox extends Interactable{
	/*Constructor for TextBox with Super for Interactable with an
	inner PauseBox builtin*/
	constructor(centerX,centerY){
		super(centerX,centerY);
		this.pauseBox = undefined;
		this.width  = 200;
		this.inner  = 200/4;
		this.height = 150;
		this.x 			= centerX - 200/2; 
		this.y 			= centerY - 150/2;
		this.hOffset=0;
		this.vOffset=0;
		this.frame=0;
		this.paused=false;
		this.canPause=true;
		this.canUnpause=false;
		this.auto=false;
	}
	/*Load audio and load the PauseBox*/
	loadTextbox(type){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=1;
			this.type=type;
			this.buttons 				= new Image();
			this.buttons.addEventListener("load", imgLoadedHandler);
			this.buttons.src    		= "assets/ui/ui_buttons.png";

			this.audioClick = new Audio();
			this.audioClick.src = "assets/audio/ui/ui_transition.ogg";

			this.pauseBox = new PauseBox(69);
			this.pauseBox.load(this.type);

			function imgLoadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}
	/*Show hotkey and recieve input*/
	updateInteractable(player,keys){
		if (this.auto==false){
			if (player.x+player.width/2 > this.x && player.x+player.width/2 < this.x+this.width){
				this.inArea=true;
				this.percent = 1-Math.abs((((player.x+player.width/2)-this.centerX)*100)/this.width)/100;
				if (this.percent>=(3/4)){
					this.ratio=1;
					this.frame++;
					if (keys[this.pauseBox.hotkey] && this.paused==false && this.canPause==true){
						this.audioClick.volume=0.3;
						this.canPause=false;
						this.pauseBox.firstFrame=true;
						this.paused=true;
						this.audioClick.play();
		
						this.frame=0;
					}
					if (this.frame>40 && this.paused==true){
						this.canUnPause=true;
					}

					if(keys[this.pauseBox.hotkey] && this.paused==true && this.canUnPause==true){
						this.canUnPause=false;
						this.paused=false;

						this.frame=0;
					}
					if (this.frame>150 && this.paused==false){
						this.pauseBox.firstFrame=true;

						this.canPause=true;
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
		else{
			this.frame++;
					if (this.frame>40 && this.paused==true){
						this.canUnPause=true;
					}

					if(keys[this.pauseBox.hotkey] && this.paused==true && this.canUnPause==true){
						this.canUnPause=false;
						this.paused=false;

						this.frame=0;
					}
					if (this.frame>150 && this.paused==false){
						this.pauseBox.firstFrame=true;

						this.canPause=true;
					}
		}
	}
	autoStart(){
		this.paused=true;
		this.audioClick.volume=0.3;
		this.pauseBox.firstFrame=true;
		this.canPause=false;
		this.frame=0;
		this.audioClick.play();
	}
	/*Render the interactable*/
	draw(ctx){
		if (this.triggered==false && this.auto==false){			
			this.drawPrompt(ctx);
		}
	}
}