function main() {
    // Create canvas
    var canvas = document.getElementById('canvas');
    canvas.style.background = "black";
    canvas.height = window.innerHeight - (window.innerHeight / 2);
    canvas.width = document.getElementById('main-container').offsetWidth;

    // Create canvas context
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    canvasContext.strokeStyle = "white";
    canvasContext.closePath();

    var isPainting = false;
    var drawSize = 10;
    var drawSizeLabel = document.getElementById('draw-size-label');
    var previousCanvases = [];

    function startDrawing() {
        var image = new Image();
        image.src = canvas.toDataURL();
        previousCanvases.push(image);

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
        canvasContext.lineWidth = drawSize;
        canvasContext.lineCap = "round";
        
        // Draw line
        canvasContext.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
        canvasContext.stroke(); 
    }

    function setBackgroundColor(event) {
        canvas.style.background = event.target.value;
    }

    function setDrawColor(event) {
        canvasContext.strokeStyle = event.target.value;
    }

    function clear() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    function increase() {
        if (drawSize < 25) {
            drawSize += 5;
            drawSizeLabel.innerHTML = "Размер курсора: " + drawSize;
        }
    }

    function decrease() {
        if (drawSize > 5) {
            drawSize -= 5;
            drawSizeLabel.innerHTML = "Размер курсора: " + drawSize;
        }
    }

    function undo()
    {
        if (previousCanvases.length > 0)
        {
            canvasContext.clearRect(0,0,canvas.width, canvas.height);
            canvasContext.drawImage(previousCanvases[previousCanvases.length - 1], 0, 0);
            previousCanvases.pop();
        }
    }

    // Add listeners
    canvas.addEventListener('mousedown', startDrawing);  
    canvas.addEventListener('mouseup',stopDrawing);  
    canvas.addEventListener('mousemove',draw);
    document.getElementById('background-color-picker').addEventListener('input', setBackgroundColor);
    document.getElementById('draw-color-picker').addEventListener('input', setDrawColor);
    document.getElementById('clear-button').addEventListener('click', clear);
    document.getElementById('increase-button').addEventListener('click', increase);
    document.getElementById('decrease-button').addEventListener('click', decrease);
    document.getElementById('undo-button').addEventListener('click', undo);
    document.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'z') { undo(); }});
}