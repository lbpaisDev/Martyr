class Entity{

	/*Entity constructor (simple)*/
	constructor(x,y,w,h){
		/*Entity Attributes*/
		this.x			= x;
		this.y			= y;
		this.width		= w;
		this.height		= h;
		this.velX		= 0;
		this.velY		= 0;
	}

	/*Collision calculator helpers*/
	getMidX(){

		return this.x+this.width/2;
	}
	getMidY(){

		return this.y+this.height/2;
	}
	getLeft(){	

		return this.x;			  
	}
	getRight(){	

		return this.x+this.width; 
	}
	getTop(){	

		return this.y;			  
	}
	getBottom(){

		return this.y+this.height;
	}

	/*Draw collider bounding box for debug*/
	drawBoundingRect(ctx){
		ctx.fillStyle="red";
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillStyle="black";
		ctx.fillRect(this.x+1,this.y+1,this.width-2,this.height-2);
	}
}
