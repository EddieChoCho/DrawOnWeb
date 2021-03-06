var tabList = [];
var canvasStateArray = [];
var fisrtDraw = false;
var testJScommunication= 20160626;

function drawingOrAdding(){

    if(fisrtDraw == false)
    {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            for(var i=0; i<tabs.length; i++)
            {
                tabList.push(tabs[i].id);
                canvasStateArray.push("");

            }
        });
        fisrtDraw = true;
    }

    if(fisrtDraw == true)
    {
        chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
            var tabNo = searchArray(tabs[0].id, tabList);
            var targetTab = tabs[0].id;

            if(tabNo == -1)
            {
                tabList.push(tabs[0].id);
                tabNo = tabList.length -1;
                canvasStateArray.push("ON");
                chrome.tabs.executeScript(targetTab, {file: "executeScript_addCanvas.js"});
            }
            else
            {
                
                if(canvasStateArray[tabNo] == "")
                {
                    canvasStateArray[tabNo] = "ON";
                    chrome.tabs.executeScript(targetTab, {file: "executeScript_addCanvas.js"});
                }
                else if(canvasStateArray[tabNo] == "ON")
                {
                    chrome.tabs.executeScript(targetTab, {file: "executeScript_drawing.js"});
                }
                else if(canvasStateArray[tabNo] == "OFF")
                {
                    canvasStateArray[tabNo] = "ON";
                    chrome.tabs.executeScript(targetTab, {file: "executeScript_addCanvas.js"});
                }
            }
        });
    }
}

function removing(){
    if(fisrtDraw == true)
    {
        chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
            var tabNo = searchArray(tabs[0].id, tabList);
            var targetTab = tabs[0].id;
            if(tabNo != -1)
            {
                if(canvasStateArray[tabNo] == "ON")
                {
                    canvasStateArray[tabNo] = "OFF";
                    chrome.tabs.executeScript(targetTab, {file: "executeScript_removeCanvas.js"});
                }

            }
        });
    }
}

function searchArray(query, dataArray)
{
    var queryNo = -1;
    for(var i=0; i< dataArray.length; i++)
    {
        if(query == dataArray[i])
        {
            queryNo = i;
        }
    }
    return queryNo;
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.tobackground == "ADD")
    {
    	drawingOrAdding();
    }
    if (request.tobackground == "Erase")
    {
    	chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
        var targetTab = tabs[0].id;
        chrome.tabs.executeScript(targetTab, {file: "executeScript_erasing.js"});
        });
    }
    if (request.tobackground == "Remove")
    {
    	removing();
    }
    //=====================================================================
    if(request.requestdUrl =="please give my Url")
    {
        chrome.tabs.sendMessage(sender.tab.id, {sendUrl: sender.tab.url});
    }

});
