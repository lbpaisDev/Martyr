class PauseBox{
	constructor(hotkey){
		this.sprite 				= undefined;
		this.backgroundSprite     	= undefined;
		this.type          			= undefined;
		this.paused 				= false;
		this.pauseDelay     		= 1;
		this.canPause       		= true;
		this.canUnPause     		= false;
		this.frame         			= 0;
		this.hotkey 				= hotkey;
		this.firstFrame             = true;
	}

	load(type){
		return new Promise((resolve,reject)=>{
			var nLoad=0;
			var maxLoad=1;
			this.type=type;
			this.sprite= new Image();
			this.sprite.addEventListener("load",loadedHandler);
			this.sprite.src="assets/ui/ui_prompt"+type+".png";

			this.backgroundSprite= new Image();
			this.backgroundSprite.addEventListener("load",loadedHandler);
			this.backgroundSprite.src="assets/ui/ui_promptBackground.png";

			function loadedHandler(ev){
				nLoad++;
				if (nLoad==maxLoad){
					resolve();
				}
			}
		});
	}

	recieveInput(keys){
		this.frame++;
		if (keys[this.hotkey] && this.paused==false && this.canPause==true){
			this.canPause=false;
			this.firstFrame=true;
			this.paused=true;
			this.frame=0;
		}
		if (this.frame>10 && this.paused==true){
			this.canUnPause=true;
		}
		if(keys[this.hotkey] && this.paused==true && this.canUnPause==true){
			this.canUnPause=false;
			this.paused=false;
			this.frame=0;
		}
		if (this.frame>10 && this.paused==false){
			this.canPause=true;
			this.firstFrame=true;
		}
	}
	draw(ctx){
		if (this.firstFrame==true){
			ctx.globalAlpha=0.5
			ctx.drawImage(this.backgroundSprite,0,0);
			ctx.globalAlpha=1;
			this.firstFrame=false;
		}
		ctx.drawImage(this.sprite,0,0);
	}
}