var mainCanvas;
var canvasContext;
var ecbCanvas;
var ecbCanvasContext;
var cbcCanvas;
var cbcCanvasContext;
var previousCanvases = [];
var lastCanvasImage;
var isFirstCanvasLoad = false;
var penColor = "white";
var penWidth = 10;
var isEraserActive = false;
var backgroundColor = "black";
var mainContainerPadding = 30;

document.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'z') { undoCanvas(); }});

function loadCanvas() {
    // Styles
    document.getElementById('main-container').style = "padding: 0px " + mainContainerPadding + "px;";
    document.getElementById('canvas-pen-color-button').style = "background-color:" + penColor + "; color:" + penColor + ";";
    document.getElementById('canvas-background-color-button').style = "background-color:" + backgroundColor + "; color:" + backgroundColor + ";";

    // Main canvas
    mainCanvas = document.getElementById('main-canvas');
    mainCanvas.style.background = backgroundColor;
    mainCanvas.height = window.innerHeight - (window.innerHeight / 2);
    mainCanvas.width = document.getElementById('main-container').offsetWidth - 2 * mainContainerPadding;

    canvasContext = mainCanvas.getContext("2d", { willReadFrequently: true });
    canvasContext.beginPath();
    canvasContext.lineWidth = penWidth;
    canvasContext.strokeStyle = "white";
    canvasContext.fillStyle = "white";
    canvasContext.lineCap = "round";
    canvasContext.closePath();

    // Ecb canvas
    ecbCanvas = document.getElementById('ecb-canvas');
    ecbCanvas.style.background = "black";
    ecbCanvas.height = window.innerHeight - (window.innerHeight / 2) ;
    ecbCanvas.width = document.getElementById('main-container').offsetWidth - 2 * mainContainerPadding;
    
    ecbCanvasContext = ecbCanvas.getContext("2d", { willReadFrequently: true });

    // Cbc canvas
    cbcCanvas = document.getElementById('cbc-canvas');
    cbcCanvas.style.background = "black";
    cbcCanvas.height = window.innerHeight - (window.innerHeight / 2);
    cbcCanvas.width = document.getElementById('main-container').offsetWidth - 2 * mainContainerPadding;
    
    cbcCanvasContext = cbcCanvas.getContext("2d", { willReadFrequently: true });

    // Drawing variables
    var isDraw = false;
    var isMoved = false;

    // Load image from local storage
    var savedImage = localStorage.getItem("image");
    var img = new Image();

    if (isFirstCanvasLoad) {
        img.src = lastCanvasImage;
    } else {
        img.src = savedImage;
        lastCanvasImage = savedImage;
        isFirstCanvasLoad = true;
    }

    if (savedImage !== null && lastCanvasImage !== null) {
        img.onload = function() {
            canvasContext.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
        }
    }

    // Drawing functions
    function startDrawing() {
        previousCanvases.push(canvasContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height));

        isDraw = true;
        isMoved = false;
        canvasContext.beginPath();
    }

    function stopDrawing(event) {
        if (!isMoved && isDraw) {
            canvasContext.arc(event.pageX - mainCanvas.offsetLeft, event.pageY - mainCanvas.offsetTop, 2, 0, 2 * Math.PI);
            canvasContext.stroke();
        }

        canvasContext.closePath();
        isDraw = false;
        lastCanvasImage = mainCanvas.toDataURL();
    }

    function draw(event) {
        if(!isDraw) return;

        // Draw line
        canvasContext.lineTo(event.pageX - mainCanvas.offsetLeft, event.pageY - mainCanvas.offsetTop);
        canvasContext.stroke();
        
        // Change variable to draw points with mouse move
        isMoved = true;
    }

    function drawOver(event) {
        if(!isDraw) return;

        if ((event.buttons & 1) !== 1) {
            stopDrawing(event);
        }
    }

    // Add canvas listeners
    mainCanvas.onmousedown = startDrawing;  
    mainCanvas.onmouseup = stopDrawing;  
    mainCanvas.onmousemove = draw;
    mainCanvas.onmouseover = drawOver;
}

function setBackgroundColor(event) {
    mainCanvas.style.background = event.target.value;
    backgroundColor = event.target.value;
    document.getElementById('canvas-background-color-button').style = "background-color:" + backgroundColor + "; color:" + backgroundColor + ";";
}

function setPenColor(event) {
    canvasContext.strokeStyle = event.target.value;
    canvasContext.fillStyle = event.target.value;
    penColor = event.target.value;

    document.getElementById('canvas-pen-color-button').style = "background-color:" + penColor + "; color:" + penColor + ";";
}

function setPenColorFromButton(color) {
    canvasContext.strokeStyle = color;
    canvasContext.fillStyle = color;
    penColor = color;

    document.getElementById('canvas-pen-color-button').style = "background-color:" + penColor + "; color:" + penColor + ";";
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function increasePenWidth() {
    if (penWidth < 25) {
        penWidth += 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = penWidth;
    }
}

function decreasePenWidth() {
    if (penWidth > 5) {
        penWidth -= 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = penWidth;
    }
}

function undoCanvas()
{
    if (previousCanvases.length > 0)
    {
        canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        canvasContext.putImageData(previousCanvases[previousCanvases.length - 1], 0, 0);
        previousCanvases.pop();
    }
}

function encryptCanvas() {
    function fillEmptyPixels(pix) {
        const hex = mainCanvas.style.background;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i + 3] == 0) {
                pix[i] = parseInt(hex.substring(1, 3), 16);
                pix[i + 1] = parseInt(hex.substring(3, 5), 16);
                pix[i + 2] = parseInt(hex.substring(5, 7), 16);
                pix[i + 3] = 255;
            }
        }
    }

    // An example 128-bit key
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    // Ecb encryption
    var imgd = canvasContext.getImageData(0, 0, ecbCanvas.width, ecbCanvas.height);
    var pix = imgd.data;
    fillEmptyPixels(pix);

    var aesEcb = new aesjs.ModeOfOperation.ecb(key);
    var encryptedBytes = aesEcb.encrypt(pix);
    
    for (var i = 0, n = pix.length; i < n; i += 1) {
        pix[i] = encryptedBytes[i];
    }

    ecbCanvasContext.putImageData(imgd, 0, 0);

    // Cbc encryption
    var aesCbc = new aesjs.ModeOfOperation.cbc(key);
    var encryptedBytes = aesCbc.encrypt(pix);

    for (var i = 0, n = pix.length; i < n; i += 1) {
        pix[i] = encryptedBytes[i];
    }

    cbcCanvasContext.putImageData(imgd, 0, 0);
}

function toggleEraser() {
    if (isEraserActive) {
        canvasContext.globalCompositeOperation = "destination-over";
        canvasContext.strokeStyle = drawColor;
        isEraserActive = false;
    } else {
        canvasContext.globalCompositeOperation = "destination-out";  
        canvasContext.strokeStyle  = "rgba(255,255,255,1)";
        drawColor = canvasContext.fillStyle;
        isEraserActive = true;
    }
}

function loadFileToCanvas(event) {
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(event.target.files[0]);
    var img = new Image();
    img.src = url;
    img.onload = function() {
        canvasContext.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
    }
}

function showBackgroundColorPicker(elemIndex) {
    var picker;
    if (elemIndex == 1) {
        picker = document.getElementById('canvas-background-color-picker');
    } else if (elemIndex == 2) {
        picker = document.getElementById('canvas-pen-color-picker');
    }

    picker.click();
}

function closeCanvas() {
    if (window.localStorage.getItem('image') !== null) {
        window.localStorage.removeItem('image');
    }
    window.localStorage.setItem('image', mainCanvas.toDataURL());
}

function resizeCanvas() {
    loadCanvas();
}