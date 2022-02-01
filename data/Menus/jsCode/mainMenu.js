"use strict";

(function() {
  window.addEventListener("load", main);
})();

var menuAudio = new Audio();
menuAudio.volume=0.4;
menuAudio.src="../../assets/audio/music/mu_menu.mp3";

function main() {
  menuAudio.play();
  var frame = document.getElementsByTagName("iframe")[0];
  var body = document.getElementsByTagName("body")[0];
  var play = document.getElementById("play");
  var help = document.getElementById("help");
  var credits = document.getElementById("credits");
  var quit = document.getElementById("quit");
  fadeIn(body,500);

  function buttonListenerHoover(ev){
      switch(ev.currentTarget.id){
          case "play":
            play.src = "../assets/ui_btnPlay_on.png"
            var audioHover = document.getElementsByTagName("audio")[0];
            audioHover.volume = 0.05;
            audioHover.play();
            break;

        case "help":
            help.src = "../assets/ui_btnHelp_on.png"
            var audioHover = document.getElementsByTagName("audio")[0];
            audioHover.volume = 0.05;
            audioHover.play();
            break;
        
        case "credits":
            credits.src = "../assets/ui_btnCredits_on.png"
            var audioHover = document.getElementsByTagName("audio")[0];
            audioHover.volume = 0.05;
            audioHover.play();
            break;
            
        case "quit":
            quit.src = "../assets/ui_btnQuit_on.png"
            var audioHover = document.getElementsByTagName("audio")[0];
            audioHover.volume = 0.05;
            audioHover.play();
            break;
      }
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

  function buttonListenerNoHoover(ev){
    switch(ev.currentTarget.id){
        case "play":
          play.src = "../assets/ui_btnPlay_off.png"
          break;
          
      case "help":
          help.src = "../assets/ui_btnHelp_off.png"
          break;
      
      case "credits":
          credits.src = "../assets/ui_btnCredits_off.png"
          break;
          
      case "quit":
          quit.src = "../assets/ui_btnQuit_off.png"
          break;
    }
}
    play.addEventListener("mouseover", buttonListenerHoover)
    help.addEventListener("mouseover", buttonListenerHoover)
    credits.addEventListener("mouseover", buttonListenerHoover)
    quit.addEventListener("mouseover", buttonListenerHoover)

    play.addEventListener("mouseout", buttonListenerNoHoover)
    help.addEventListener("mouseout", buttonListenerNoHoover)
    credits.addEventListener("mouseout", buttonListenerNoHoover)
    quit.addEventListener("mouseout", buttonListenerNoHoover)

    var msg = function(ev){
        messageHandler(ev, play, "1");
        messageHandler(ev, help, "2");
        messageHandler(ev, credits, "3");
        messageHandler(ev, quit, "4");
    }
    window.addEventListener("message", msg);
}

function messageHandler(ev, btn, option){
    var main = ev.source;

    var changePage = function(ev){
        main.postMessage(option, '*');
    }
    btn.addEventListener("click", changePage);
}

function windowClose() {
    if (confirm("Are you sure ?")) {
      window.close();
    }
  }