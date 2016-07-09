
document.getElementById("btDrawing").onclick = function(e){addCanvas();}
document.getElementById("btErasing").onclick = function(e){erasing();}
document.getElementById("btRemovingCanvas").onclick = function(e){removeCanvas();}


function addCanvas() {
  chrome.runtime.sendMessage({
      tobackground: "ADD"
    });
}

function erasing() {
  chrome.runtime.sendMessage({
      tobackground: "Erase"
    });
}

function removeCanvas() {
  chrome.runtime.sendMessage({
      tobackground: "Remove"
    });
}