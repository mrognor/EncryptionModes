var mainCanvas;
var canvasContext;
var ecbCanvas;
var ecbCanvasContext;
var cbcCanvas;
var cbcCanvasContext;
var previousCanvases = [];
var lastCanvasImage;
var isFirstCanvasLoad = true;
var penColor = "white";
var penWidth = 10;
var isEraserActive = false;
var backgroundColor = "black";
var mainContainerPadding = 30;
var minimalPenWidth = 5;
var maximalPenWidth = 25;

document.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'z') { undoCanvas(); }});

function loadCanvas() {
    // Styles
    document.getElementById('main-container').style = "padding: 0px " + mainContainerPadding + "px;";
    document.getElementById('canvas-pen-color-button').style = "background-color:" + penColor + "; color:" + penColor + ";";
    document.getElementById('canvas-background-color-button').style = "background-color:" + backgroundColor + "; color:" + backgroundColor + ";";

    if (isFirstCanvasLoad) {
        // Load old pen color
        if (window.localStorage.getItem('penColor') !== null) {
            penColor = window.localStorage.getItem('penColor');
            document.getElementById('canvas-pen-color-button').style = "background-color:" + penColor + "; color:" + penColor + ";";
        }

        // Load background color
        if (window.localStorage.getItem('backgroundColor') !== null) {
            backgroundColor = window.localStorage.getItem('backgroundColor');
            document.getElementById('canvas-background-color-button').style = "background-color:" + backgroundColor + "; color:" + backgroundColor + ";";
        }
    }

    // Main canvas
    mainCanvas = document.getElementById('main-canvas');
    mainCanvas.style.background = backgroundColor;
    mainCanvas.height = window.innerHeight - (window.innerHeight / 2);
    mainCanvas.width = document.getElementById('main-container').offsetWidth - 2 * mainContainerPadding;

    canvasContext = mainCanvas.getContext("2d", { willReadFrequently: true });
    canvasContext.beginPath();
    canvasContext.lineWidth = penWidth;
    canvasContext.strokeStyle = penColor;
    canvasContext.fillStyle = penColor;
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
    var ongoingTouches = [];

    // Load image from local storage
    var savedImage = localStorage.getItem("image");
    var img = new Image();

    if (isFirstCanvasLoad) {
        img.src = savedImage;
        lastCanvasImage = savedImage;
    } else {
        if (lastCanvasImage !== null) {
            img.src = lastCanvasImage;
        }
    }

    if (savedImage !== null || lastCanvasImage !== null) {
        img.onload = function() {
            canvasContext.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
        }
    }

    // Desktop drawing functions
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

    // Mobile drawing functions
    function handleTouchStart(event) {
        previousCanvases.push(canvasContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height));

        event.preventDefault();

        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            canvasContext.beginPath();
            canvasContext.arc(touches[i].pageX - mainCanvas.offsetLeft, touches[i].pageY - mainCanvas.offsetTop, 4, 0, 2 * Math.PI, false); // a circle at the start
            canvasContext.fill();
        }
    }

    function handleTouchMove(event) {
        event.preventDefault();

        var touches = event.changedTouches;
      
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
        
            if (idx >= 0) {
                canvasContext.beginPath();
                canvasContext.lineWidth = penWidth;
                canvasContext.lineCap = "round";
                canvasContext.moveTo(ongoingTouches[idx].pageX - mainCanvas.offsetLeft, ongoingTouches[idx].pageY - mainCanvas.offsetTop);
                canvasContext.lineTo(touches[i].pageX - mainCanvas.offsetLeft, touches[i].pageY - mainCanvas.offsetTop);
                canvasContext.stroke();
                ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            }
        }
    }

    function handleTouchEnd(event) {
        event.preventDefault();

        var touches = event.changedTouches;
      
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
      
            if (idx >= 0) {
                canvasContext.beginPath();
                canvasContext.moveTo(ongoingTouches[idx].pageX - mainCanvas.offsetLeft, ongoingTouches[idx].pageY - mainCanvas.offsetTop);
                canvasContext.lineTo(touches[i].pageX - mainCanvas.offsetLeft, touches[i].pageY - mainCanvas.offsetTop);
                ongoingTouches.splice(idx, 1); // remove it; we're done
            }
        }
    }

    function handleTouchCancel(event) {
        event.preventDefault();

        var touches = event.changedTouches;
      
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
    }

    function copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
    }

    function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;
      
            if (id == idToFind) {
                return i;
            }
        }
        return -1; // not found
    }

    // Add canvas listeners
    mainCanvas.onmousedown = startDrawing;  
    mainCanvas.onmouseup = stopDrawing;  
    mainCanvas.onmousemove = draw;
    mainCanvas.onmouseover = drawOver;
    mainCanvas.ontouchstart = handleTouchStart;
    mainCanvas.ontouchend = handleTouchEnd;
    mainCanvas.ontouchcancel = handleTouchCancel;
    mainCanvas.ontouchmove = handleTouchMove;
    isFirstCanvasLoad = false;
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
    lastCanvasImage = null;
}

function increasePenWidth() {
    if (penWidth < maximalPenWidth) {
        penWidth += 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = penWidth;
        window.localStorage.setItem('penWidth', penWidth);
    }
}

function decreasePenWidth() {
    if (penWidth > minimalPenWidth) {
        penWidth -= 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = penWidth;
        window.localStorage.setItem('penWidth', penWidth);
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
    var key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 16; ++i) {
        var elem = document.getElementById('canvas-data-input-' + i);
        var byteValue = "00";
        if (elem.value.startsWith("0x")) {
            byteValue = elem.value.slice(2);
        }
        key[i] = parseInt(byteValue, 16);
    }

    // Ecb encryption
    var imgd = canvasContext.getImageData(0, 0, ecbCanvas.width, ecbCanvas.height);
    var pix = imgd.data;
    fillEmptyPixels(pix);

    var aesEcb = new aesjs.ModeOfOperation.ecb(key);
    var encryptedBytes = aesEcb.encrypt(aesjs.padding.pkcs7.pad(pix));
    
    for (var i = 0, n = pix.length; i < n; i += 1) {
        pix[i] = encryptedBytes[i];
    }

    ecbCanvasContext.putImageData(imgd, 0, 0);

    // Cbc encryption
    var aesCbc = new aesjs.ModeOfOperation.cbc(key);
    var encryptedBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(pix));

    for (var i = 0, n = pix.length; i < n; i += 1) {
        pix[i] = encryptedBytes[i];
    }

    cbcCanvasContext.putImageData(imgd, 0, 0);
}

function toggleEraser() {
    if (isEraserActive) {
        canvasContext.globalCompositeOperation = "source-over";
        canvasContext.strokeStyle = penColor;
        isEraserActive = false;
        mainCanvas.style.cursor = "pointer";
    } else {
        canvasContext.globalCompositeOperation = "destination-out";  
        canvasContext.strokeStyle  = "rgba(255,255,255,1)";
        isEraserActive = true;
        mainCanvas.style.cursor = "crosshair";
    }
}

function loadFileToCanvas(event) {
    if (event.target.files.length == 0) {
        return;
    }

    previousCanvases.push(canvasContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height));

    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(event.target.files[0]);
    var img = new Image();
    img.src = url;
    img.onload = function() {
        if (mainCanvas.width > mainCanvas.height) {
            var ratio = mainCanvas.height / img.height;
            var imgWidth = img.width * ratio;
            canvasContext.drawImage(img, (mainCanvas.width / 2) - (imgWidth / 2), 0, imgWidth, mainCanvas.height);
        } else {
            var ratio = mainCanvas.width / img.width;
            var imgHeight = img.height * ratio;
            canvasContext.drawImage(img, 0, (mainCanvas.height / 2) - (imgHeight / 2), mainCanvas.width, imgHeight);
        }

        lastCanvasImage = mainCanvas.toDataURL();
    }

    document.getElementById('canvas-file-input').value = "";
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
    window.localStorage.setItem('penColor', penColor);
    window.localStorage.setItem('backgroundColor', backgroundColor);
}

function resizeCanvas() {
    loadCanvas();
}