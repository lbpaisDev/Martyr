"use strict";

(function() {
  window.addEventListener("load", main);
})();

var startingPage=9;
function main() {
  var startPage = 9;
  showPage(startPage);
  window.addEventListener("message", messageHandler);
  
}

function showPage(pageNum) {
  var frame = document.getElementsByTagName("iframe")[0];
  if (pageNum === 1) {
    frame.src = "../../Intro.html";
  }else if (pageNum === 4) {
    window.close();
  }else if(isNaN(pageNum)){
    frame.src = "../htmlCode/main.html"
  }else if(pageNum === 9){
    frame.src= "../htmlCode/splashMenu.html"
  }
  else{
    
    frame.src = "../htmlCode/menu" + pageNum + ".html";
  }
  var loaded = function(ev) {
    startingPage=1;
    frame.contentWindow.postMessage("", "*");
  };
  frame.addEventListener("load", loaded);
}

function hidePage(pageNum){
    var frame = document.getElementsByTagName("iframe")[0];
    frame.src = "";
}

function messageHandler(ev){
    var str = ev.data
    changePage(ev);
}

function changePage(ev){
    var frame = document.getElementsByTagName("iframe")[0];
    var frameName = frame.src;
    var pageNum = Number(frameName.charAt(frameName.length - 6));
    var str = ev.data;
    var newPageNum = parseInt(str);
    var audioHover = document.getElementsByTagName("audio")[0];
    if (startingPage==9 || startingPage==0){
      audioHover.volume=0.1;
    }
    else{
      audioHover.volume = 0.6;
    }
    audioHover.pause()
    audioHover.play();
    
    hidePage(pageNum);
    showPage(newPageNum);
   
    
}