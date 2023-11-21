window.onload = function()
{
    var button = document.getElementById("previewButton");
    button.onclick = previewHandler;
    makeImage();
}

function previewHandler()
{
    var canvas = document.getElementById("tshirtCanvas");
    var context = canvas.getContext("2d");
    fillBackgroundColor(canvas, context);
    
    var selectObj = document.getElementById("shape");
    var index = selectObj.selectedIndex;
    var shape = selectObj[index].value;
    
    if (shape == "squares")
    {
        for (var squares = 0; squares < 20; squares++)
        {
            drawSquare(canvas, context);
        }
    }
    else if (shape == "circles")
    {
        for (var circles = 0; circles < 20; circles++)
        {
            drawCircle(canvas, context);
        }
    }
    
    drawText(canvas, context);
    drawBird(canvas, context);
}

function makeImage()
{
    var canvas = document.getElementById("tshirtCanvas");
    canvas.onclick = function()
    {
        window.location = canvas.toDataURL("image/png");
    }
}

function drawBird(canvas, context)
{
    var twitterBird = new Image();
    twitterBird.src = "twitterBird.png";
    twitterBird.onload = function()
    {
        context.drawImage(twitterBird, 20, 120, 30, 30)
    };
}

function drawText(canvas, context)
{
    var selectedObj = document.getElementById("foregroundColor");
    var index = selectedObj.selectedIndex;
    var fgColor = selectedObj[index].value;
    
    context.fillStyle = fgColor;
    context.font = "bold 1em sans-serif";
    context.textAlign = "left";
    context.fillText("I saw this tweet", 20, 40);
    
    selectedObj = document.getElementById("tweets");
    index = selectedObj.selectedIndex;
    var tweet = selectedObj[index].value;
    
    context.font = "italic 1.2em serif";
    context.fillText(tweet, 30, 100);
    
    context.font = "bold 1em sans-serif";
    context.textAlign = "right";
    context.fillText("and all I got was this lousy t-shirt", canvas.width - 20, canvas.height - 40);
}
function fillBackgroundColor(canvas, context)
{
    var selectObj = document.getElementById("backgroundColor");
    var index = selectObj.selectedIndex;
    var bgColor = selectObj.options[index].value;
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(canvas, context)
{
    var radius = Math.floor(Math.random() * 40);
    var x = Math.floor(Math.random() * canvas.width);
    var y = Math.floor(Math.random() * canvas.height);

    context.beginPath();
    context.arc(x, y, radius, 0, degreesToRadians(360), true);
    
    context.fillStyle = "red";
    context.fill();
}

function drawSquare(canvas, context)
{
    var w = Math.floor(Math.random() * 40);
    var x = Math.floor(Math.random() * canvas.width);
    var y = Math.floor(Math.random() * canvas.height);
    
    context.fillStyle = "lightblue";
    context.fillRect(x, y, w, w);
}

function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}