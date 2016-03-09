(function () {

    var sizeX = 9;
    var sizeY = 9;
    var cellContentList = [];
    var minesList = [];
    var ticks = 0;
    var isGameStart = 0;
    var isGameEnd = 0;
    var minesNumber = 0;

    document.oncontextmenu = cmenu;
    function cmenu() {
        return false;
    }

    function fieldCreator(sizeX, sizeY) {
        cellContentList = mineGenerator(sizeX, sizeY);
        var tableNode = document.createElement('table');
        document.body.appendChild(tableNode);
        var table = document.querySelector('table');
        for (var j = 0; j < sizeY; j++) {
            var rowNode = document.createElement('tr');
            table.appendChild(rowNode);
            for (var i = 0; i < sizeX; i++) {
                var cellNode = document.createElement('td');
                cellNode.setAttribute('id', i + j * sizeX);
                table.appendChild(cellNode);
            }
        }

        var cellList = document.querySelectorAll('td');

        for (var i = 0; i < cellList.length; i++) {
            var buttonNode = document.createElement('button');
            buttonNode.setAttribute('class', 'initial');
            buttonNode.setAttribute('id', i);
            cellList[i].appendChild(buttonNode);
        }
    }

    function highLiting() {
        document.body.addEventListener("mouseover", function (event) {
            if ((event.target.nodeName == "BUTTON") && (event.target.getAttribute('class') != 'marked') && (event.target.getAttribute('class') != 'newGame')) {
                event.target.setAttribute('class', 'new');
            }
        });
        document.body.addEventListener("mouseout", function (event) {
            if ((event.target.nodeName == "BUTTON") && (event.target.getAttribute('class') != 'marked') && (event.target.getAttribute('class') != 'newGame')) {
                event.target.setAttribute('class', 'initial');
            }
        });
    }

    function cellContent() {

        document.body.addEventListener("click", function (event) {
            var currentCell = document.querySelectorAll('td');
            if ((event.target.nodeName == "BUTTON") && (event.target.getAttribute('class') != 'marked')) {
                if (cellContentList[event.target.id] != 'buh') {
                    isGameStart++;
                    for (var i = 0; i < currentCell.length; i++) {
                        if ((currentCell[i].id == event.target.id) && (currentCell[i].textContent != 'buh')) {
                            currentCell[i].textContent = cellContentList[event.target.id];
                        }
                    }
                } else {
                    isGameEnd++;
                    var table = document.querySelector('table');
                    var gameOverNode = document.createElement('span');

                    var gameOverMessage = document.createTextNode('Game over');
                    gameOverNode.appendChild(gameOverMessage);
                    gameOverNode.setAttribute('style', 'margin-top: -' + (table.offsetHeight / 2 + 100) + 'px;');
                    table.appendChild(gameOverNode);
                    var currentCell = document.querySelectorAll('td');
                    for (var i = 0; i < currentCell.length; i++) {
                        if (cellContentList[i] == 'buh') {
                            currentCell[i].textContent = '';
                            currentCell[i].setAttribute('class', 'mine');
                        }
                    }
                    var restButtons = document.querySelectorAll('button');
                    for (var i = 0; i < restButtons.length; i++) {
                            restButtons[i].setAttribute('disabled', 'false');
                    }
                }

                if (cellContentList[event.target.id] == '') {
                    var emptyOpenCell = emptyCell(event, cellContentList);
                    for (var i = 0; i < currentCell.length; i++) {
                        if (emptyOpenCell.indexOf(Number(currentCell[i].id)) >= 0) {
                            currentCell[i].textContent = cellContentList[i];
                        }
                    }
                }
                var currentButton = document.querySelectorAll('button');
                if (((sizeX * sizeY == 9 * 9) && (currentButton.length == 10)) ||
                    ((sizeX * sizeY == 16 * 16) && (currentButton.length == 40)) ||
                    ((sizeX * sizeY == 30 * 16) && (currentButton.length == 99))) {
                    isGameEnd++;

                    var winNode = document.createElement('span');
                    var winMessage = document.createTextNode('You are win!!!!');
                    winNode.appendChild(winMessage);
                    document.body.appendChild(winNode);

                }

                if ((isGameStart == 1) || (isGameEnd == 1)) {
                    timeCounter();
                }
            }
        });
    }


    function emptyCell(event, data) {
        var currentId = Number(event.target.id);
        var workArray = new Array(sizeX * sizeY);
        var cellList = [];
        cellList.push(currentId);
        workArray[currentId] = true;

        function neiborDetermination(event, data, cellId) {

            var j = Math.floor(cellId / sizeX);

            var i = cellId - j * sizeX;

            var naiborList = [];

            if ((data[i + j * sizeX - 1] == '') && (i > 0)) {
                naiborList.push(i + j * sizeX - 1);
            }
            if ((data[i + j * sizeX + 1] == '') && (i < sizeX - 1)) {
                naiborList.push(i + j * sizeX + 1);
            }
            if ((data[i + j * sizeX - sizeX] == '') && (j > 0)) {
                naiborList.push(i + j * sizeX - sizeX);
            }
            if ((data[i + j * sizeX - sizeX + 1] == '') && (j > 0) && (i < sizeX - 1)) {
                naiborList.push(i + j * sizeX - sizeX + 1);
            }
            if ((data[i + j * sizeX - sizeX - 1] == '') && (j > 0) && (i > 0)) {
                naiborList.push(i + j * sizeX - sizeX - 1);
            }
            if ((data[i + j * sizeX + sizeX] == '') && (j < sizeY - 1)) {
                naiborList.push(i + j * sizeX + sizeX);
            }
            if ((data[i + j * sizeX + sizeX + 1] == '') && (j < sizeY - 1) && (i < sizeX - 1)) {
                naiborList.push(i + j * sizeX + sizeX + 1);
            }
            if ((data[i + j * sizeX + sizeX - 1] == '') && (j < sizeY - 1) && (i > 0)) {
                naiborList.push(i + j * sizeX + sizeX - 1);
            }

            for (var l = 0; l < naiborList.length; l++) {
                if (workArray[naiborList[l]] != true) {
                    cellList.push(naiborList[l]);
                    workArray[naiborList[l]] = true;
                }
            }
        }

        for (var m = 0; m < cellList.length; m++) {
            neiborDetermination(event, data, cellList[m]);
        }
        return cellList;
    }

    function minesMarker() {
        document.body.addEventListener("mousedown", function (event) {
            if ((event.target.nodeName == "BUTTON") && (event.which == 3) && (event.target.getAttribute('class') != 'marked')) {
                event.target.setAttribute('class', 'marked');
                minesList.push(event.target.id);
                var divElement = document.querySelectorAll('div');
                divElement[2].textContent = minesList.length;
            } else if ((event.target.nodeName == "BUTTON") && (event.which == 3) && (event.target.getAttribute('class') == 'marked')) {
                event.target.setAttribute('class', 'initial');
                var position = minesList.indexOf(event.target.id);
                minesList.splice(position, 1);
                var divElement = document.querySelectorAll('div');
                divElement[2].textContent = minesList.length;
            }
        });
    }

    function timeCounter() {
        var divElement = document.querySelectorAll('div');
        var clock = setInterval(function () {
            if ((isGameStart > 0) && (isGameEnd == 0)) {
                ticks++;
                divElement[3].textContent = ticks;
            } else if (isGameStart == 0) {
                clearInterval(clock);
            }
        }, 1000);
    }

    function sizeMenu() {
// create menu text
        var menuNode = document.createElement('div');
        document.body.appendChild(menuNode);

        var selectNode = document.createElement('th');
        var selectName = document.createTextNode('Choose filed size:');
        selectNode.appendChild(selectName);
        menuNode.appendChild(selectNode);

        var minesCountNode = document.createElement('th');
        var minesCountNodeName = document.createTextNode('Mines number:');
        minesCountNode.appendChild(minesCountNodeName);
        menuNode.appendChild(minesCountNode);

        var timeCountNode = document.createElement('th');
        var timeCountNodeName = document.createTextNode('Time:');
        timeCountNode.appendChild(timeCountNodeName);
        menuNode.appendChild(timeCountNode);

// create menu content
        var selectNodeDiv = document.createElement('div');

        var sizeNode = document.createElement('select');
        for (var i = 0; i < 3; i++) {
            var menu = document.createElement('option');
            if (i == 0) {
                var menuText = document.createTextNode('9x9');
            }
            else if (i == 1) {
                var menuText = document.createTextNode('16x16');
            }
            else if (i == 2) {
                var menuText = document.createTextNode('30x16');
            }
            menu.appendChild(menuText);
            sizeNode.appendChild(menu);
        }
        selectNodeDiv.appendChild(sizeNode);

        var minesCounterNode = document.createElement('div');
        var timeCounterNode = document.createElement('div');
        minesCounterNode.textContent = minesList.length;
        timeCounterNode.textContent = 0;
        selectNodeDiv.appendChild(minesCounterNode);
        selectNodeDiv.appendChild(timeCounterNode);
        document.body.appendChild(selectNodeDiv);

        var divElement = document.querySelectorAll('div');
        divElement[0].setAttribute('class', 'center');
        divElement[1].setAttribute('class', 'center');
        divElement[2].setAttribute('style', 'margin: -20px 0 0 235px;');
        divElement[3].setAttribute('style', 'margin: -20px 0 0 395px;');

// create select event
        var select = document.querySelector("select");
        select.setAttribute('style', 'margin: 30px 0 0 75px;');
        select.addEventListener("change", function () {
                for (var i = 0; i < select.options.length; i++) {
                    var table = document.querySelector('table');
                    var option = select.options[i];
                    if (option.selected) {
                        if (option.value == '9x9') {
                            sizeX = 9;
                            sizeY = 9;
                            initialValues(table, sizeX, sizeY)
                        } else if (option.value == '16x16') {
                            sizeX = 16;
                            sizeY = 16;
                            initialValues(table, sizeX, sizeY)
                        } else if (option.value == '30x16') {
                            sizeX = 30;
                            sizeY = 16;
                            initialValues(table, sizeX, sizeY)
                        }
                    }
                }
            }
        );

        var newGameButton = document.createElement('input');
        newGameButton.setAttribute('type', 'button');
        newGameButton.setAttribute('class', 'newGame');
        newGameButton.setAttribute('value', 'New Game');
        document.body.appendChild(newGameButton);
        newGameButton.addEventListener("click", function () {
            var table = document.querySelector('table');
            initialValues(table, sizeX, sizeY);
        });
    }

    function initialValues(table, sizeX, sizeY) {
        table.remove();
        isGameStart = 0;
        isGameEnd = 0;
        minesList = [];
        ticks = 0;
        var spanEl = document.querySelector('span');
        if (spanEl) {
            spanEl.remove();
        }
        var divElement = document.querySelectorAll('div');
        divElement[2].textContent = 0;
        divElement[3].textContent = 0;
        fieldCreator(sizeX, sizeY);
    }

    function mineGenerator(sizeX, sizeY) {
        var cellsArray = new Array(sizeX * sizeY);
        if (cellsArray.length == 9 * 9) {
            minesNumber = 10;
        } else if (cellsArray.length == 16 * 16) {
            minesNumber = 40;
        }
        else if (cellsArray.length == 30 * 16) {
            minesNumber = 99;
        }
        while (minesNumber > 0) {
            var rand = Math.floor(Math.random() * (cellsArray.length + 1));
            if ((cellsArray[rand] != 'buh') && (rand <= cellsArray.length)) {
                cellsArray[rand] = 'buh';
                minesNumber--;
            }
        }

        findNaibour(cellsArray, sizeX, sizeY);
        return cellsArray;
    }

    function findNaibour(array, sizeX, sizeY) {
        for (var j = 0; j < sizeY; j++) {
            for (var i = 0; i < sizeX; i++) {
                var mineNumber = 0;
                if (array[i + j * sizeX] != 'buh') {
                    if ((array[i + j * sizeX + 1] == 'buh') && (i < sizeX - 1)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX - 1] == 'buh') && (i > 0)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX + sizeX] == 'buh') && (j < sizeY - 1)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX - sizeX] == 'buh') && (j > 0)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX - sizeX + 1] == 'buh') && (j > 0) && (i < sizeX - 1)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX - sizeX - 1] == 'buh') && (j > 0) && (i > 0)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX + sizeX + 1] == 'buh') && (j < sizeY - 1) && (i < sizeX - 1)) {
                        mineNumber++;
                    }
                    if ((array[i + j * sizeX + sizeX - 1] == 'buh') && (j < sizeY - 1) && (i > 0)) {
                        mineNumber++;
                    }
                    if (mineNumber > 0) {
                        array[i + j * sizeX] = mineNumber;
                    } else {
                        array[i + j * sizeX] = '';
                    }
                }
            }
        }
        return array;
    }

    highLiting();
    cellContent();
    minesMarker();
    sizeMenu();
    fieldCreator(sizeX, sizeY);
}());