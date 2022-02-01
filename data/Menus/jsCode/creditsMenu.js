"use strict";
 (function() {
    window.addEventListener("load", main);
}());

function main(){
    var viewport = document.getElementById("viewport");
    var vpctx = viewport.getContext("2d");
    
    var music = new Audio();
    var background = new Image();
    var skip = new Image();
    var frameCounter=0;
    var ratio=1;
    var keys = [];
    document.body.addEventListener("keydown",function(ev){ keys[ev.keyCode]=true;  });
    document.body.addEventListener("keyup",  function(ev){ keys[ev.keyCode]=false; });
    initializeComponents();
    function initializeComponents(){
        var nLoad=0;
        var totLoad=3;
        music.addEventListener("canplaythrough",loadHandler);
        music.src = "../../assets/audio/music/mu_credits.mp3";
        music.volume=0.4;
        background.addEventListener("load",loadHandler);
        background.src = "../../assets/ui/ui_credits.png";
        skip.addEventListener("load",loadHandler);
        skip.src = "../../assets/ui/ui_skip.png";

        function loadHandler(ev){
            nLoad++;
            if (nLoad==totLoad){
                introLoop();
            }
        }
    }
    function introLoop(){
        var t = function(time){
            introLoop();
        }
        music.play();
        var reqID = window.requestAnimationFrame(t);
        animationLoop(reqID);
    }

    function animationLoop(reqID){
        if (keys[69]){
            frameCounter=1800;
        }
        frameCounter+=0.5;
        vpctx.clearRect(0,0,640,360);
        if (frameCounter>1800){
            ratio-=0.01;
            if (ratio<=0){
                ratio=0;
                cancelAnimationFrame(reqID);
                music.pause();
                window.location.href = "../htmlCode/menu0.html"
            }
        }
        vpctx.globalAlpha=ratio;
        vpctx.drawImage(background,0,-440+frameCounter,640,360,0,0,640,360);
        vpctx.drawImage(skip,640-43,320);
    }
}