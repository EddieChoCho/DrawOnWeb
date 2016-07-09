var currentUrl = "";
var getUrl = false;
chrome.runtime.sendMessage({requestdUrl: "please give my Url"});
var jsonText="";

var woodboardBorder = 0;
var woodboardWidth = document.body.scrollWidth; 
var woodboardHeight = document.body.scrollHeight; 

var whiteboard = document.createElement("CANVAS");
document.body.appendChild(whiteboard); 
var canvasLineWidth  = 10 ;
whiteboard.width=woodboardWidth - canvasLineWidth;
whiteboard.height=woodboardHeight - canvasLineWidth;
whiteboard.style.border ="1px solid #d3d3d3";
whiteboard.style.position = "absolute";
whiteboard.style.left = "0px";
whiteboard.style.top = "0px";
whiteboard.style.zIndex = "2147483647";





//繪圖
whiteboard.addEventListener("mousedown", startDrawing);
whiteboard.addEventListener("mousemove", drawing);
whiteboard.addEventListener("mouseup", stopDrawing);


var ctx = whiteboard.getContext("2d");
    ctx.strokeStyle="#0000ff";
    ctx.lineWidth = canvasLineWidth;

var mouseX;
var mouseY;
var tempX;
var tempY;

var checkMouse=0;
var coordinateDataX=[];
var coordinateDataY=[];
var dataX=[];
var dataY=[];

function startDrawing() {
    mouseX = event.clientX + document.body.scrollLeft;
    mouseY = event.clientY + document.body.scrollTop;
    ctx.beginPath();  

    dataX.push(mouseX);
    dataY.push(mouseY);   

    checkMouse=1;

}


function drawing() {
    if(checkMouse == 1)
    {
        var tempX = event.clientX + document.body.scrollLeft;
        var tempY = event.clientY + document.body.scrollTop;

        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(tempX, tempY);
        ctx.stroke();
        mouseX = event.clientX + document.body.scrollLeft;
        mouseY = event.clientY + document.body.scrollTop;

        dataX.push(mouseX);
        dataY.push(mouseY);        
    }
}

function stopDrawing() {
    checkMouse=0;

    coordinateDataX.push(dataX);
    coordinateDataY.push(dataY);
    dataX = [];
    dataY = [];
    //ctx.stroke();
}

function addInitialDataToJson() {
    jsonText +="{\n   \"userID\": \""+9527+"\",";
    jsonText +="\n   \"url\": \""+ currentUrl +"\",";
    jsonText +="\n   \"lines\": [";
    jsonText +="\n      {";
    jsonText +="\n     \"line\": [";
}
function addLineDataToJson() {
    for(var i = 0; i < coordinateDataX.length; i++)
    {
        jsonText +="\n            {";
        jsonText +="\n               \"lineID\": "+ i;
        jsonText +="\n               \"color\": "+ "#0000ff";
        jsonText +="\n               \"width\": "+ canvasLineWidth;
        jsonText +="\n               \"coordinates\": [";
        for(var j = 0; j < coordinateDataX[i].length; j++)
        {
            jsonText +="\"x\": " + coordinateDataX[i][j]+", \"y\": "+ coordinateDataX[i][j] + ",";
        }
        jsonText +="]";
        jsonText +="\n            },";
    }
    jsonText +="]";
    jsonText +="\n    }]";
    jsonText +="\n}";
    alert(jsonText);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.sendUrl !="" && getUrl == false)
    {
        currentUrl = request.sendUrl;
        addInitialDataToJson();
        getUrl = true;
    }
    if(request.toTab == "please send data")
    {
        addLineDataToJson();
    }
 });