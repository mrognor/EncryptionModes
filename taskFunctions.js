/**
    Разработано Аммаевым Тимуром в 2024 году.
    Я c++ разработчик, а не веб разработчик, но волею судеб я умею в веб(я так думаю:)).
    Если вы веб разработчик и считаете, что я сделал фигню, то не судите строго.
    Я постарался сделать для вас красиво и удобно, т.е. с темной темой и кроссплатформенно).
    Поставьте мне звезду на гх, пожалуйста). https://github.com/mrognor/EncryptionModes
    Не знаю как у вас дела, но надеюсь все хорошо. Удачи вам!
*/

function loadTasks() {
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

    // Add task listeners
    for (var i = 0; i < 4; i++) {
        document.getElementById('ecb-task-data-b' + i).addEventListener('focus', focusHexInput);
        document.getElementById('ecb-task-data-b' + i).addEventListener('input', verifyHexInput);
        document.getElementById('ecb-task-data-b' + i).addEventListener('blur', addHexPrefix);
    }
    document.getElementById('ecb-task-button').addEventListener('click', ecbTask);
}