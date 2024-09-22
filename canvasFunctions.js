var mainCanvas;
var canvasContext;
var ecbCanvas;
var ecbCanvasContext;
var cbcCanvas;
var cbcCanvasContext;
var previousCanvases = [];
var penColor = "white";
var penWidth = 10;
var isEraserActive = false;

function loadCanvas() {
    // Main canvas
    mainCanvas = document.getElementById('main-canvas');
    mainCanvas.style.background = "black";
    mainCanvas.height = window.innerHeight - (window.innerHeight / 2);
    mainCanvas.width = document.getElementById('main-container').offsetWidth;

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
    ecbCanvas.width = document.getElementById('main-container').offsetWidth;
    
    ecbCanvasContext = ecbCanvas.getContext("2d", { willReadFrequently: true });

    // Cbc canvas
    cbcCanvas = document.getElementById('cbc-canvas');
    cbcCanvas.style.background = "black";
    cbcCanvas.height = window.innerHeight - (window.innerHeight / 2);
    cbcCanvas.width = document.getElementById('main-container').offsetWidth;
    
    cbcCanvasContext = cbcCanvas.getContext("2d", { willReadFrequently: true });

    // Drawing variables
    var isDraw = false;
    var isMoved = false;

    // Load image from local storage
    const savedImage = localStorage.getItem("image");

    if (savedImage !== null) {
        var img = new Image();
        img.src = savedImage;
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
        isDraw = false;

        if (!isMoved) {
            console.log("Z");
            canvasContext.arc(event.pageX - mainCanvas.offsetLeft, event.pageY - mainCanvas.offsetTop, 2, 0, 2 * Math.PI);
            canvasContext.stroke();
        }

        canvasContext.closePath();
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

    // Canvas encryption functions
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

    function encryptCanvas() {
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

    // Add canvas listeners
    mainCanvas.addEventListener('mousedown', startDrawing);  
    mainCanvas.addEventListener('mouseup', stopDrawing);  
    mainCanvas.addEventListener('mousemove', draw);
    mainCanvas.addEventListener('mouseover', drawOver);
    document.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'z') { undoCanvas(); }});
    document.getElementById('ecb-button').addEventListener('click', encryptCanvas);
}

function setBackgroundColor(event) {
    mainCanvas.style.background = event.target.value;
}

function setPenColor(event) {
    canvasContext.strokeStyle = event.target.value;
    canvasContext.fillStyle = event.target.value;
    penColor = event.target.value;
}

function setPenColorFromButton(color) {
    console.log(color);
    console.log(canvasContext.strokeStyle)
    canvasContext.strokeStyle = color;
    canvasContext.fillStyle = color;
    penColor = color;
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function increasePenWidth() {
    if (penWidth < 25) {
        penWidth += 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = "Размер курсора: " + penWidth;
    }
}

function decreasePenWidth() {
    if (penWidth > 5) {
        penWidth -= 5;
        canvasContext.lineWidth = penWidth;
        document.getElementById('pen-width-label').innerHTML = "Размер курсора: " + penWidth;
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

function toggleEraser() {
    console.log("Z");
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

function closeCanvas() {
    if (window.localStorage.getItem('image') !== null) {
        window.localStorage.removeItem('image');
    }
    window.localStorage.setItem('image', mainCanvas.toDataURL());
}

function resizeCanvas() {
    closeCanvas();
    document.getElementById('canvas-container').outerHTML = document.getElementById('canvas-container').outerHTML;
    loadCanvas();
}