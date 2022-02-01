function lerp (start,end,amt){return (1-amt)*start+amt*end}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;}
class Camera{
	constructor(player,w,h,type){
		/*Entity Attributes*/
		this.width 	 = w;
		this.height  = h;
		this.type 	 = type;
		this.x 		 = Math.floor(player.x- w/2);
		this.y 		 = Math.floor(player.y- h/2);
		this.shaking = false;
		this.frame	 = 0;
		this.magnitude = 1;

		this.onActor   = false;
		this.actor     = undefined;
	}
	updateCamera(entity){
		if (entity.dead==true){
			return;
		}
		if (this.onActor == false){
			var player = entity;
			if (player.heading==1){
				this.x = Math.floor(lerp(this.x,
									(player.x-this.width/2)+80, 
									0.1));
				this.y = Math.floor(lerp(this.y, 
									player.y-this.height/2-30, 
									0.1));
			}
			else{
				this.x = Math.floor(lerp(this.x,
									(player.x-this.width/2+40), 
									0.1));
				this.y = Math.floor(lerp(this.y, 
									player.y-this.height/2-30, 
									0.1));
			}
			if (this.shaking == true){
				this.frame++;
				this.x = Math.floor(lerp(this.x,
									(player.x-this.width/2)+80, 
									0.1));
				this.y = Math.floor(lerp(this.y, 
									player.y-this.height/2-30, 
									0.1));
				this.x -= getRndInteger(-this.magnitude , this.magnitude-1);

				if (this.frame > 10){
					this.shaking = false;
					this.frame = 0;
				}
			}
		}
		else{
			this.x = Math.floor(lerp(this.x,
								(this.actor.centerX-this.width/2), 
								0.1));
			this.y = Math.floor(lerp(this.y, 
								this.actor.centerY-this.height/2-30, 
								0.1));
		}
	}
	bindActor(actor){
		this.onActor=true;
		this.actor=actor;
	}
	unbindActor(actor){
		this.onActor=false;
		this.actor=undefined;
	}
	shake(magnitude){
		this.magnitude = magnitude;
		this.shaking = true;
	}
}
//pMARTYR_0.8 ECMAscript Class
//Description: