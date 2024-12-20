/**
    Разработано Аммаевым Тимуром в 2024 году.
    Я c++ разработчик, а не веб разработчик, но волею судеб я умею в веб(я так думаю:)).
    Если вы веб разработчик и считаете, что я сделал фигню, то не судите строго.
    Я постарался сделать для вас красиво и удобно, т.е. с темной темой и кроссплатформенно).
    Поставьте мне звезду на гх, пожалуйста). https://github.com/mrognor/EncryptionModes
    Не знаю как у вас дела, но надеюсь все хорошо. Удачи вам!
*/

function verifyHexInput(event) {
    var elem = event.target;

    if (elem.value.match(/[^0-9a-fA-F]/g)) {
        elem.value = elem.value.replace(/[^0-9a-fA-F]/g, '');
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

function loadTask() {
    // Byte input
    function focusHexInput(event) {
        var elem = event.target;

        if (elem.value.startsWith("0x")) {
            elem.value = elem.value.slice(2);
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

function resizeTask() {
    resizeDataMatrix();
}

// Encryption tasks

function loadEncryptionTask() {
    var variant = document.getElementById("encryption-select").value;

    if (variant == 1) {
        document.getElementById('cfb-svg').style.display = "none";
        document.getElementById('ofb-svg').style.display = "none";
        document.getElementById('cbc-svg').style.display = "block";
    } else if (variant == 2) {
        document.getElementById('cbc-svg').style.display = "none";
        document.getElementById('ofb-svg').style.display = "none";
        document.getElementById('cfb-svg').style.display = "block";
    } else if (variant == 3) {
        document.getElementById('ofb-svg').style.display = "block";
        document.getElementById('cbc-svg').style.display = "none";
        document.getElementById('cfb-svg').style.display = "none";
    }
}

function ecbEncryptionTask() {
    var key = [];
    for (var i = 0; i < 4; i += 1) {
        key.push(document.getElementById('ecb-task-key-' + i).value);
    }

    for (var i = 0; i < 16; i += 4) {
        document.getElementById('ecb-k' + i).innerHTML = key[0].slice(2);
        document.getElementById('ecb-k' + (i + 1)).innerHTML = key[1].slice(2);
        document.getElementById('ecb-k' + (i + 2)).innerHTML = key[2].slice(2);
        document.getElementById('ecb-k' + (i + 3)).innerHTML = key[3].slice(2);
    }

    var data = [];
    for (var i = 0; i < 16; i += 1) {
        data.push(document.getElementById('ecb-task-data-' + (i)).value.slice(2));
        document.getElementById('ecb-o' + i).innerHTML = data[i];
    }

    for (var i = 0; i < 16; i += 4) {
        document.getElementById('ecb-e' + i).innerHTML = (parseInt(key[0], 16) ^ parseInt(data[i], 16)).toString(16);
        document.getElementById('ecb-e' + (i + 1)).innerHTML = (parseInt(key[1], 16) ^ parseInt(data[i + 1], 16)).toString(16);
        document.getElementById('ecb-e' + (i + 2)).innerHTML = (parseInt(key[2], 16) ^ parseInt(data[i + 2], 16)).toString(16);
        document.getElementById('ecb-e' + (i + 3)).innerHTML = (parseInt(key[3], 16) ^ parseInt(data[i + 3], 16)).toString(16);
    }
}

function cbcCfbOfbEncryptionTask() {
    var key = [];
    for (var i = 0; i < 4; i += 1) {
        key.push(document.getElementById('cbc-cfb-ofb-task-key-' + i).value);
    }

    for (var i = 0; i < 16; i += 4) {
        document.getElementById('cbc-k' + i).innerHTML = key[0].slice(2);
        document.getElementById('cfb-k' + i).innerHTML = key[0].slice(2);
        document.getElementById('ofb-k' + i).innerHTML = key[0].slice(2);

        document.getElementById('cbc-k' + (i + 1)).innerHTML = key[1].slice(2);
        document.getElementById('cfb-k' + (i + 1)).innerHTML = key[1].slice(2);
        document.getElementById('ofb-k' + (i + 1)).innerHTML = key[1].slice(2);

        document.getElementById('cbc-k' + (i + 2)).innerHTML = key[2].slice(2);
        document.getElementById('cfb-k' + (i + 2)).innerHTML = key[2].slice(2);
        document.getElementById('ofb-k' + (i + 2)).innerHTML = key[2].slice(2);

        document.getElementById('cbc-k' + (i + 3)).innerHTML = key[3].slice(2);
        document.getElementById('cfb-k' + (i + 3)).innerHTML = key[3].slice(2);
        document.getElementById('ofb-k' + (i + 3)).innerHTML = key[3].slice(2);
    }

    var iv = [];
    for (var i = 0; i < 4; i += 1) {
        iv.push(document.getElementById('cbc-cfb-ofb-task-iv-' + i).value);
    }

    {
        document.getElementById('cbc-i0').innerHTML = iv[0].slice(2);
        document.getElementById('cfb-i0').innerHTML = iv[0].slice(2);
        document.getElementById('ofb-i0').innerHTML = iv[0].slice(2);

        document.getElementById('cbc-i1').innerHTML = iv[1].slice(2);
        document.getElementById('cfb-i1').innerHTML = iv[1].slice(2);
        document.getElementById('ofb-i1').innerHTML = iv[1].slice(2);

        document.getElementById('cbc-i2').innerHTML = iv[2].slice(2);
        document.getElementById('cfb-i2').innerHTML = iv[2].slice(2);
        document.getElementById('ofb-i2').innerHTML = iv[2].slice(2);

        document.getElementById('cbc-i3').innerHTML = iv[3].slice(2);
        document.getElementById('cfb-i3').innerHTML = iv[3].slice(2);
        document.getElementById('ofb-i3').innerHTML = iv[3].slice(2);
    }

    var data = [];
    for (var i = 0; i < 16; i += 1) {
        data.push(document.getElementById('cbc-cfb-ofb-task-data-' + (i)).value.slice(2));
        document.getElementById('cbc-o' + i).innerHTML = data[i];
        document.getElementById('cfb-o' + i).innerHTML = data[i];
        document.getElementById('ofb-o' + i).innerHTML = data[i];
    }

    cbcCfbIv = iv;
    for (var i = 0; i < 16; i += 4) {
        tmpVec = [];
        tmpVec.push((parseInt(key[0], 16) ^ parseInt(cbcCfbIv[0], 16) ^ parseInt(data[i], 16)).toString(16));
        tmpVec.push((parseInt(key[1], 16) ^ parseInt(cbcCfbIv[1], 16) ^ parseInt(data[i + 1], 16)).toString(16));
        tmpVec.push((parseInt(key[2], 16) ^ parseInt(cbcCfbIv[2], 16) ^ parseInt(data[i + 2], 16)).toString(16));
        tmpVec.push((parseInt(key[3], 16) ^ parseInt(cbcCfbIv[3], 16) ^ parseInt(data[i + 3], 16)).toString(16));
    
        document.getElementById('cbc-e' + i).innerHTML = tmpVec[0];
        document.getElementById('cfb-e' + i).innerHTML = tmpVec[0];

        document.getElementById('cbc-e' + (i + 1)).innerHTML = tmpVec[1];
        document.getElementById('cfb-e' + (i + 1)).innerHTML = tmpVec[1];
    
        document.getElementById('cbc-e' + (i + 2)).innerHTML = tmpVec[2];
        document.getElementById('cfb-e' + (i + 2)).innerHTML = tmpVec[2];

        document.getElementById('cbc-e' + (i + 3)).innerHTML = tmpVec[3];
        document.getElementById('cfb-e' + (i + 3)).innerHTML = tmpVec[3];
        cbcCfbIv = tmpVec;
    }

    ofbIv = iv;
    for (var i = 0; i < 16; i += 4) {
        tmpVec = [];
        tmpVec.push((parseInt(key[0], 16) ^ parseInt(ofbIv[0], 16)).toString(16));
        tmpVec.push((parseInt(key[1], 16) ^ parseInt(ofbIv[1], 16)).toString(16));
        tmpVec.push((parseInt(key[2], 16) ^ parseInt(ofbIv[2], 16)).toString(16));
        tmpVec.push((parseInt(key[3], 16) ^ parseInt(ofbIv[3], 16)).toString(16));
        ofbIv = tmpVec;

        document.getElementById('ofb-e' + i).innerHTML = (parseInt(ofbIv[0], 16) ^ parseInt(data[i], 16)).toString(16);
        document.getElementById('ofb-e' + (i + 1)).innerHTML = (parseInt(ofbIv[1], 16) ^ parseInt(data[i + 1], 16)).toString(16);
        document.getElementById('ofb-e' + (i + 2)).innerHTML = (parseInt(ofbIv[2], 16) ^ parseInt(data[i + 2], 16)).toString(16);
        document.getElementById('ofb-e' + (i + 3)).innerHTML = (parseInt(ofbIv[3], 16) ^ parseInt(data[i + 3], 16)).toString(16);
    }
}

function ctrEncryptionTask() {
    var variant = document.getElementById("ctr-select").value;

    var ctr = [];
    for (var i = 0; i < 16; i++) {
        document.getElementById('ctr-c' + i).innerHTML = 0;
        ctr.push(0);
    }

    if (variant == 1) {
        document.getElementById('ctr-c3').innerHTML = 1;
        document.getElementById('ctr-c7').innerHTML = 2;
        document.getElementById('ctr-c11').innerHTML = 3;
        document.getElementById('ctr-c15').innerHTML = 4;
        ctr[3] = 1;
        ctr[7] = 2;
        ctr[11] = 3;
        ctr[15] = 4;
    } else if (variant == 2) {
        document.getElementById('ctr-c3').innerHTML = 2;
        document.getElementById('ctr-c7').innerHTML = 4;
        document.getElementById('ctr-c11').innerHTML = 8;
        document.getElementById('ctr-c15').innerHTML = 10;
        ctr[3] = 2;
        ctr[7] = 4;
        ctr[11] = 8;
        ctr[15] = 10;
    }

    var key = [];
    for (var i = 0; i < 4; i += 1) {
        key.push(document.getElementById('ctr-task-key-' + i).value);
    }

    for (var i = 0; i < 16; i += 4) {
        document.getElementById('ctr-k' + i).innerHTML = key[0].slice(2);
        document.getElementById('ctr-k' + (i + 1)).innerHTML = key[1].slice(2);
        document.getElementById('ctr-k' + (i + 2)).innerHTML = key[2].slice(2);
        document.getElementById('ctr-k' + (i + 3)).innerHTML = key[3].slice(2);
    }

    var data = [];
    for (var i = 0; i < 16; i += 1) {
        data.push(document.getElementById('ctr-task-data-' + (i)).value.slice(2));
        document.getElementById('ctr-o' + i).innerHTML = data[i];
    }

    for (var i = 0; i < 16; i += 4) {
        document.getElementById('ctr-e' + i).innerHTML = (parseInt(key[0], 16) ^ parseInt(ctr[i], 16) ^parseInt(data[i], 16)).toString(16);
        document.getElementById('ctr-e' + (i + 1)).innerHTML = (parseInt(key[1], 16) ^ parseInt(ctr[i + 1], 16) ^ parseInt(data[i + 1], 16)).toString(16);
        document.getElementById('ctr-e' + (i + 2)).innerHTML = (parseInt(key[2], 16) ^ parseInt(ctr[i + 2], 16) ^parseInt(data[i + 2], 16)).toString(16);
        document.getElementById('ctr-e' + (i + 3)).innerHTML = (parseInt(key[3], 16) ^ parseInt(ctr[i + 3], 16) ^parseInt(data[i + 3], 16)).toString(16);
    }
}

// Data matrix task
var isGridHiden = false;
var dataMatrixSize = 12;

function drawDataMatrixTask() {
    var datatMatrixButtonSize = document.getElementById('dm-textarea').clientWidth / dataMatrixSize;
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

function resizeDataMatrix() {
    var datatMatrixButtonSize = document.getElementById('dm-textarea').clientWidth / dataMatrixSize;
    document.getElementById('dm-textarea').style.minHeight = dataMatrixSize * datatMatrixButtonSize + "px";

    Array.prototype.forEach.call(document.getElementsByClassName('dm-button'), el => {
        el.style.width = datatMatrixButtonSize + "px";
        el.style.height = datatMatrixButtonSize + "px";
    });
}

function loadDataMatrixTask() {
    var variant = document.getElementById("dm-select").value;
    var taskData = "";
    if (variant == 1) {
        taskData = '000000000000 010101010100 010101101110 010100001100 011011110110 010010110000 010001111010 010011111100 010001101110 010101001000 011111111110 000000000000';
    } else if (variant == 2) {
        taskData = '000000000000 010101010100 010101101110 010001101000 011110000110 010110010000 010111011010 011100001100 011001111110 010100010100 011111111110 000000000000';
    } else if (variant == 3) {
        taskData = '000000000000 010101010100 010101110110 010000011100 011110110110 010101000100 010100000010 011000010000 011101100010 010100000100 011111111110 000000000000';
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

// Flag task
var realWidth = 0, realHeight = 0;

function loadFlagTask() {
    var variant = document.getElementById("flag-select").value;
    var taskFilePath = "";
    if (variant == 1) {
        taskFilePath = "resources/Flag1.png";
    } else if (variant == 2) {
        taskFilePath = "resources/Flag2.png";
    } else if (variant == 3) {
        taskFilePath = "resources/Flag3.png";
    }

    if (taskFilePath != "") {
        var img = new Image();
        img.src = taskFilePath;
        img.onload = function() {
            realWidth = img.width;
            realHeight = img.height;
            document.getElementById('flag-to-decrypt').src = img.src;
        }
    }
}

function flagDecrypt() {
    const img = document.getElementById('flag-to-decrypt');
    const canvas = document.createElement("canvas");
    canvas.width = realWidth;
    canvas.height = realHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;

    // Add padding
    var hex = document.getElementById("flag-key").value + "00000000";

    var keyA = parseInt(hex.substring(0, 2), 16), keyB = parseInt(hex.substring(2, 4), 16), keyC = parseInt(hex.substring(4, 6), 16), keyD = parseInt(hex.substring(6, 8), 16);
    for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i] = pix[i] ^ keyA;
        pix[i + 1] = pix[i + 1] ^ keyB;
        pix[i + 2] = pix[i + 2] ^ keyC;
        pix[i + 3] = 255 ^ keyD;
    }

    ctx.putImageData(imgd, 0, 0);

    document.getElementById('flag-decrypted').src = canvas.toDataURL();
}