class Scene{

	/*Constructor for composite background and scene class*/
	constructor(parallax3, parallax2, parallax1, parallax0, tile, mapWidth, mapHeight){
		//Get the canvasses
		this.p0 = new Image();
		this.p1 = new Image();
		this.p2 = new Image();
		this.p3 = new Image();
		this.p4 = new Image();
		this.level          = 1;

		this.offset 		= 0;
		this.offset2 		= -mapWidth;
		this.mapWidth		= mapWidth;
		this.mapHeight		= mapHeight;

		this.parallax0		= parallax0;
		this.parallax1		= parallax1;
		this.parallax2 		= parallax2;
		this.parallax3 		= parallax3;
		this.tile			= tile;
		this.frame          = 0;

		this.playingAudio   = false;
		this.canPlay 		= false;
	}

	loadScene(level,mapWidth,mapHeight){	
		var parallax0 = this.parallax0;
		var parallax1 = this.parallax1;
		var parallax2 = this.parallax2;
		var parallax3 = this.parallax3;
		var tile      = this.tile;
		var mapWidth  = this.mapWidth;
		var mapHeight = this.mapHeight;
		var level = level;

		return new Promise((resolve,reject)=>{
			this.audioAmbient = undefined;
			this.audioAmbient = new Audio();
			this.audioAmbient.autoplay=true;
			this.audioAmbient.volume=0.0;
			this.audioAmbient.muted=true;
			this.audioAmbient.src = "assets/audio/scene/"+level+"_ambient.ogg";
			var nLoad = 0;
			var maxLoad = 5;
			var p0 			= new Image();
			p0.id 			= "parallax0";
			p0.addEventListener("load", imgLoadedHandler);
			var p1 			= new Image();
			p1.id 			= "parallax1";
			p1.addEventListener("load", imgLoadedHandler);
			var p2 			= new Image();
			p2.id 			= "parallax2";
			p2.addEventListener("load", imgLoadedHandler);
			var p3 			= new Image();
			p3.id 			= "parallax3";
			p3.addEventListener("load", imgLoadedHandler);
			var p4 			= new Image();
			p4.id 			= "parallax4";
			p4.addEventListener("load", imgLoadedHandler);
			p0.src		 	= "assets/level_"+level+"/parallax0.png";	
			p1.src 			= "assets/level_"+level+"/parallax1.png";
			p2.src 			= "assets/level_"+level+"/parallax2.png";
			p3.src 			= "assets/level_"+level+"/parallax3.png";
			p4.src 			= "assets/level_"+level+"/parallax4.png";

			function imgLoadedHandler(ev){
				var img = ev.target;
				if (ev.target.id == "parallax0"){
					this.p0 = img;
					nLoad++;
				}
				if (ev.target.id == "parallax1"){
					this.p1 = img;
					nLoad++;
				}
				if (ev.target.id == "parallax2"){
					this.p2 = img;
					nLoad++;
				}
				if (ev.target.id == "parallax3"){
					this.p3 = img;
					nLoad++;
				}
				if (ev.target.id == "parallax4"){
					this.p4 = img;
					nLoad++;
				}
				if (nLoad==maxLoad){
					function renderScene(){
							var p0ctx 		= parallax0.getContext("2d");
							var p1ctx 		= parallax1.getContext("2d");
							var p2ctx 		= parallax2.getContext("2d");
							var p3ctx 		= parallax3.getContext("2d");
							var tilectx 	= tile.getContext("2d");
							p0ctx.drawImage(p0,0,mapHeight/2);
							tilectx.drawImage(p1,0,0,mapWidth,mapHeight);
							p1ctx.drawImage(p2,0,0,mapWidth,mapHeight);
							p2ctx.drawImage(p3,0,-50,mapWidth,mapHeight);
							p3ctx.drawImage(p4,0,-50,mapWidth,mapHeight);
					}
					renderScene();
				 	resolve();
				}
			}
		});
	}

	clearScene(){
		var p0ctx 		= this.parallax0.getContext("2d");
		var p1ctx 		= this.parallax1.getContext("2d");
		var p2ctx 		= this.parallax2.getContext("2d");
		var p3ctx 		= this.parallax3.getContext("2d");
		var tilectx 	= this.tile.getContext("2d");
		p0ctx.clearRect(0,0,this.mapWidth,this.mapHeight);
		tilectx.clearRect(0,0,this.mapWidth,this.mapHeight);
		p1ctx.clearRect(0,0,this.mapWidth,this.mapHeight);
		p2ctx.clearRect(0,0,this.mapWidth,this.mapHeight);
		p3ctx.clearRect(0,0,this.mapWidth,this.mapHeight);
	}

	/*Draw the backgrounds on the viewport canvas*/
	drawBackground(ctx,camera){

		ctx.drawImage(this.parallax3,
						camera.x*0.3,
						Math.round(camera.y),
						camera.width,camera.height,
						0,0,camera.width,camera.height);

		ctx.drawImage(this.parallax2,
						Math.round(camera.x*0.5),
						Math.round(camera.y),
						camera.width,camera.height,
						0,0,camera.width,camera.height);

		ctx.drawImage(this.parallax1,
						Math.round(camera.x*0.7),
						Math.round(camera.y),
						camera.width,camera.height,
						0,0,camera.width,camera.height);
		ctx.globalCompositeOperation = 'screen';
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this.parallax0,
						Math.round((-this.offset)),
						Math.round(camera.y),
						this.mapWidth,this.mapHeight,
						0-camera.x,-100,
						this.mapWidth,this.mapHeight);
		ctx.drawImage(this.parallax0,
						Math.round((-this.offset2)),
						Math.round(camera.y),
						this.mapWidth,this.mapHeight,
						0-camera.x,-100,
						this.mapWidth,this.mapHeight);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'normal';
		this.offset++;
		this.offset2++;
		if (this.offset>this.mapWidth){
			this.offset=-this.mapWidth;
		}
		if (this.offset2>this.mapWidth){
			this.offset2=-this.mapWidth;
		}
	}
	/*Draw the foreground (tile layer)*/
	drawForeground(ctx,camera){
		ctx.drawImage(this.tile,
						Math.round(camera.x),
		 				Math.round(camera.y),
						camera.width,camera.height,
						0,0,camera.width,camera.height);
	}
	renderAudio(player){
		this.canPlay=true;
		if (this.canPlay==true && this.playingAudio==false){
			this.audioAmbient.muted=false;
			this.audioAmbient.volume=0.5;
			this.canPlay=false;
			const playPromise =this.audioAmbient.play();
			this.playingAudio=true;

		}
		
	}
}