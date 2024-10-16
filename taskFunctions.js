/**
    Разработано Аммаевым Тимуром в 2024 году.
    Я c++ разработчик, а не веб разработчик, но волею судеб я умею в веб(я так думаю:)).
    Если вы веб разработчик и считаете, что я сделал фигню, то не судите строго.
    Я постарался сделать для вас красиво и удобно, т.е. с темной темой и кроссплатформенно).
    Поставьте мне звезду на гх, пожалуйста). https://github.com/mrognor/EncryptionModes
    Не знаю как у вас дела, но надеюсь все хорошо. Удачи вам!
*/

function loadTasks() {
    // Byte input
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

        if (elem.value.length >= 2) {
            var num = elem.id.substring(elem.id.lastIndexOf("-") + 1);
            num++;
            var nextElem = document.getElementById(elem.id.substring(0, elem.id.lastIndexOf("-") + 1) + num);
            if (nextElem != null) {
                if (nextElem.value.length == 0) {
                    nextElem.focus();
                }
            }
        }
    }

    function addHexPrefix(event) {
        var elem = event.target;
        if (elem.value.length == 1) {
            elem.value = "0x0" + elem.value;
        } else if (elem.value.length == 2) {
            elem.value = "0x" + elem.value;
        }
    }

    // Add byte input listeners
    Array.prototype.forEach.call(document.getElementsByClassName('byte-input'), el => {
        el.addEventListener('focus', focusHexInput);
        el.addEventListener('blur', addHexPrefix);
        el.addEventListener('input', verifyHexInput);
    });

    drawDataMatrixTask();
}

// Encryption tasks
function ecbTask() {
    var elem1 = document.getElementById('ecb-task-data-0');
    var elem2 = document.getElementById('ecb-task-data-1');
    var elem3 = document.getElementById('ecb-task-data-2');
    var elem4 = document.getElementById('ecb-task-data-3');


    for (var i = 0; i < 16; i += 4) {
        document.getElementById('key-' + i).innerHTML = elem1.value.slice(2);
        document.getElementById('key-' + (i + 1)).innerHTML = elem2.value.slice(2);
        document.getElementById('key-' + (i + 2)).innerHTML = elem3.value.slice(2);
        document.getElementById('key-' + (i + 3)).innerHTML = elem4.value.slice(2);
    }
}

// Data matrix task
var isGridHiden = false;
var dataMatrixSize = 14;
var datatMatrixButtonSize = 40;

function drawDataMatrixTask() {
    var taskHtml = "";
    for (var i = 0; i < dataMatrixSize; ++i) {
        taskHtml += '<div class="btn-group" role="group">';
        for (var j = 0; j < dataMatrixSize; ++j) {
            taskHtml += '<button type="button" class="dm-button" style="width: ' + datatMatrixButtonSize + 'px; height: ' + datatMatrixButtonSize + 'px;"; onclick="toggleDmButton(this)">' + (i * dataMatrixSize + j) + '</button>';
        }
        taskHtml += '</div>';
    }
    document.getElementById('dm-task').innerHTML = taskHtml;

    document.getElementById('dm-textarea').style.minHeight = dataMatrixSize * datatMatrixButtonSize + "px";
}

function loadDataMatrixTask() {
    var variant = document.getElementById("dm-select").value;
    var taskData = "";
    if (variant == 1) {
        taskData = '00000000000000 01010101010100 01011001001110 01100100111000 01110000010010 01101001111000 01011001001110 01110110100000 01110000111010 01110011000100 01010001001010 01100011000100 01111111111110 00000000000000';
    } else if (variant == 2) {
        taskData = 'Заглушка';
    }

    document.getElementById('dm-textarea').value = taskData;
}

function toggleDmButton(button) {
    if (button.style.background == "" || button.style.background == "white") {
        button.style.background = "black";
        button.style.color = "white";   
    } else {
        button.style.background = "white";
        button.style.color = "black";
    }
}

function toggleDmGrid() {
    var counter = 0;

    Array.prototype.forEach.call(document.getElementsByClassName('dm-button'), el => {
        if (isGridHiden) {
            el.style.border = '1px outset black';
            el.innerHTML = counter;
        } else {
            el.style.border = '0px outset black';
            el.innerHTML = "";
        }

        counter += 1;
    });

    if (isGridHiden) {
        isGridHiden = false;
    } else {
        isGridHiden = true;
    }
}

function clearDm() {
    Array.prototype.forEach.call(document.getElementsByClassName('dm-button'), el => {
        el.style.background = 'white';
        el.style.color = "black";
    });
}