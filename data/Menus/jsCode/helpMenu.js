"use strict";
 
(function() {
    window.addEventListener("load", main);
}());

function main(){
    var frame = document.getElementsByTagName("iframe")[0];
    var body = document.getElementsByTagName("body")[0];
    var back = document.getElementById("back");
    fadeIn(body,500);
    function buttonListenerHoover(ev){
        switch(ev.currentTarget.id){
            case "back":
                var audioHover = document.getElementsByTagName("audio")[0];
                audioHover.volume = 1;
                audioHover.play();
                back.src = "../assets/ui_btnBack_on.png";
                break;
        }   
    }
    function buttonListenerNoHoover(ev){
        switch(ev.currentTarget.id){
            case "back":
                back.src = "../assets/ui_btnBack_off.png";
                break;
        }   
    }
    back.addEventListener("mouseover", buttonListenerHoover);
    back.addEventListener("mouseout", buttonListenerNoHoover);

    var msg = function(ev){
        messageHandler(ev, back, "0");
    }
    window.addEventListener("message", msg);
}

  function fadeIn(el, duration) {
    var step = 10 / duration,
        opacity = 0;
    function next() {
        if (opacity >= 1)
          return;
        el.style.opacity = ( opacity += step );
        setTimeout(next, 10);
    }
    next();
  }

function messageHandler(ev, btn, option) {
    var main = ev.source;

    var changePage = function(ev){
        main.postMessage(option, '*');    
    }
    btn.addEventListener("click", changePage);
}