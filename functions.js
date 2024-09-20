/**
    Разработано Аммаевым Тимуром в 2024 году.
    Я c++ разработчик, а не веб разработчик, но волею судеб я умею в веб(я так думаю:)).
    Если вы веб разработчик и считаете, что я сделал фигню, то не судите строго.
    Я постарался сделать для вас красиво и удобно, т.е. с темной темой и кроссплатформенно).
    Не знаю как у вас дела, но надеюсь все хорошо.
    Удачи вам!
*/

var canvas;
var canvasContext;
var ecbCanvas;
var ecbCanvasContext;
var cbcCanvas;
var cbcCanvasContext;
var drawColor = "white";

function main() {
    // Canvas
    canvas = document.getElementById('canvas');
    canvas.style.background = "black";
    canvas.height = window.innerHeight - (window.innerHeight / 2);
    canvas.width = document.getElementById('main-container').offsetWidth;

    canvasContext = canvas.getContext("2d", { willReadFrequently: true });
    canvasContext.beginPath();
    canvasContext.strokeStyle = "white";
    canvasContext.fillStyle = "white";
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

    // Variables
    var isPainting = false;
    var drawWidth = 10;
    var drawWidthLabel = document.getElementById('draw-width-label');
    var ongoingTouches = [];
    var previousCanvases = [];
    var isEraserActive = false;

    // Load image from local storage
    const savedImage = localStorage.getItem("image");
    console.log(savedImage);
    if (savedImage !== null) {
        var img = new Image();
	    img.src = savedImage;
        img.onload = function() {
		    canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
	    }
    }

    // Desktop
    function startDrawing() {
        previousCanvases.push(canvasContext.getImageData(0, 0, canvas.width, canvas.height));

        isPainting = true;
        canvasContext.beginPath();
    }

    function stopDrawing() {
        isPainting = false;
        canvasContext.closePath();
    }

    function draw(event) {
        if(!isPainting) return;

        // Line style
        canvasContext.lineWidth = drawWidth;
        canvasContext.lineCap = "round";
        
        // Draw line
        canvasContext.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
        canvasContext.stroke(); 
    }

    function drawOver(event) {
        if ((event.buttons & 1) !== 1) {
            stopDrawing();
        }
    }

    // Mobile
    function handleStart(event) {
        previousCanvases.push(canvasContext.getImageData(0, 0, canvas.width, canvas.height));

        event.preventDefault();

        var touches = event.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            canvasContext.beginPath();
            canvasContext.arc(touches[i].pageX - canvas.offsetLeft, touches[i].pageY - canvas.offsetTop, 4, 0, 2 * Math.PI, false); // a circle at the start
            canvasContext.fill();
        }
    }

    function handleMove(event) {
        event.preventDefault();

        var touches = event.changedTouches;
      
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
        
            if (idx >= 0) {
                canvasContext.beginPath();
                canvasContext.lineWidth = drawWidth;
                canvasContext.lineCap = "round";
                canvasContext.moveTo(ongoingTouches[idx].pageX - canvas.offsetLeft, ongoingTouches[idx].pageY - canvas.offsetTop);
                canvasContext.lineTo(touches[i].pageX - canvas.offsetLeft, touches[i].pageY - canvas.offsetTop);
                canvasContext.stroke();
                ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            }
        }
    }

    function handleEnd(event) {
        event.preventDefault();

        var touches = event.changedTouches;
      
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
      
            if (idx >= 0) {
                canvasContext.beginPath();
                canvasContext.moveTo(ongoingTouches[idx].pageX - canvas.offsetLeft, ongoingTouches[idx].pageY - canvas.offsetTop);
                canvasContext.lineTo(touches[i].pageX - canvas.offsetLeft, touches[i].pageY - canvas.offsetTop);
                ongoingTouches.splice(idx, 1); // remove it; we're done
            }
        }
    }

    function handleCancel(event) {
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


    // Common functions
    function setBackgroundColor(event) {
        canvas.style.background = event.target.value;
    }

    function setDrawColor(event) {
        canvasContext.strokeStyle = event.target.value;
        canvasContext.fillStyle = event.target.value;
        drawColor = event.target.value;
    }

    function clear() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    function increase() {
        if (drawWidth < 25) {
            drawWidth += 5;
            drawWidthLabel.innerHTML = "Размер курсора: " + drawWidth;
        }
    }

    function decrease() {
        if (drawWidth > 5) {
            drawWidth -= 5;
            drawWidthLabel.innerHTML = "Размер курсора: " + drawWidth;
        }
    }

    function undo()
    {
        if (previousCanvases.length > 0)
        {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.putImageData(previousCanvases[previousCanvases.length - 1], 0, 0);
            previousCanvases.pop();
        }
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

    function loadFile(event) {
        var URL = window.webkitURL || window.URL;
	    var url = URL.createObjectURL(event.target.files[0]);
	    var img = new Image();
	    img.src = url;
	    img.onload = function() {
		    canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
	    }
    }

    // Encrryption
    function fill_empty_pixels(pix) {
        const hex = canvas.style.background;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i + 3] == 0) {
                pix[i] = parseInt(hex.substring(1, 3), 16);
                pix[i + 1] = parseInt(hex.substring(3, 5), 16);
                pix[i + 2] = parseInt(hex.substring(5, 7), 16);
                pix[i + 3] = 255;
            }
        }
    }

    function encrypt() {
        // An example 128-bit key
        var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        // Ecb encryption
        var imgd = canvasContext.getImageData(0, 0, ecbCanvas.width, ecbCanvas.height);
        var pix = imgd.data;
        fill_empty_pixels(pix);

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

    // Tasks
    function focusHexInput(event) {
        var elem = event.target;

        if (elem.value.startsWith("0x")) {
            elem.value = elem.value.slice(2);
        }
    }

    function verifyHexInput(event) {
        var elem = event.target;

        if (elem.value.match(/[^0-9a-fA-F\-\+\(\)]/g)) {
            elem.value = elem.value.replace(/[^0-9a-fA-F\-\+\(\)]/g, '');
        }

        elem.value = elem.value.toLowerCase();

        var num = elem.id.substring(elem.id.lastIndexOf("b") + 1);
        num++;
        if (elem.value.length >= 2 && num < 4) {
            var nextElem = document.getElementById('ecb-task-data-b' + num);
            if (nextElem.value.length == 0) {
                nextElem.focus();
            }
        }
    }

    function addHexPrefix(event) {
        var elem = event.target;
        console.log(elem.value);
        if (elem.value.length == 1) {
            elem.value = "0x0" + elem.value;
        } else if (elem.value.length == 2) {
            elem.value = "0x" + elem.value;
        }
    }

    function ecbTask() {
        var elem1 = document.getElementById('ecb-task-data-b0');
        var elem2 = document.getElementById('ecb-task-data-b1');
        var elem3 = document.getElementById('ecb-task-data-b2');
        var elem4 = document.getElementById('ecb-task-data-b3');


        for (var i = 0; i < 16; i += 4) {
            document.getElementById('key-' + i).innerHTML = elem1.value.slice(2);
            document.getElementById('key-' + (i + 1)).innerHTML = elem2.value.slice(2);
            document.getElementById('key-' + (i + 2)).innerHTML = elem3.value.slice(2);
            document.getElementById('key-' + (i + 3)).innerHTML = elem4.value.slice(2);
        }
    }

    // Add canvas listeners
    canvas.addEventListener('mousedown', startDrawing);  
    canvas.addEventListener('mouseup', stopDrawing);  
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseover', drawOver);

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleCancel);
    canvas.addEventListener('touchmove', handleMove);

    // Add other listeners
    document.getElementById('background-color-picker').addEventListener('input', setBackgroundColor);
    document.getElementById('draw-color-picker').addEventListener('input', setDrawColor);
    document.getElementById('clear-button').addEventListener('click', clear);
    document.getElementById('increase-button').addEventListener('click', increase);
    document.getElementById('decrease-button').addEventListener('click', decrease);
    document.getElementById('undo-button').addEventListener('click', undo);
    document.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'z') { undo(); }});
    document.getElementById('ecb-button').addEventListener('click', encrypt);
    document.getElementById('eraser-checkbox').addEventListener('change', toggleEraser);
    document.getElementById('file-button').addEventListener('change', loadFile);

    // Add task listeners
    for (var i = 0; i < 4; i++) {
        document.getElementById('ecb-task-data-b' + i).addEventListener('focus', focusHexInput);
        document.getElementById('ecb-task-data-b' + i).addEventListener('input', verifyHexInput);
        document.getElementById('ecb-task-data-b' + i).addEventListener('blur', addHexPrefix);
    }
    document.getElementById('ecb-task-button').addEventListener('click', ecbTask);
}

function setDrawColorFromButton(color) {
    console.log(color);
    console.log(canvasContext.strokeStyle)
    canvasContext.strokeStyle = color;
    canvasContext.fillStyle = color;
    drawColor = color;
}

function close() {
    if (window.localStorage.getItem('image') !== null) {
        window.localStorage.removeItem('image');
    }
    window.localStorage.setItem('image', canvas.toDataURL());
}

function resize() {
    close();
    document.getElementById('canvas-container').outerHTML = document.getElementById('canvas-container').outerHTML;
    main();
}