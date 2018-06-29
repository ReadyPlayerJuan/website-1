var mainTextWidth = 40, mainTextHeight = 30;
var mainText = [];
var mainTextHighlights = [];

function initHTML() {
    var lineStart = document.getElementsByClassName("main-screen")[0];

    for (i = 0; i < mainTextHeight; i++) {
        lineStart.innerHTML += "<div id=\"main-line" + i + "\"></div>"
    }
}

function clearMainText() {
    mainText = [];
    mainTextHighlights = [];
    for (i = 0; i < mainTextHeight; i++) {
        mainText.push("");
        mainTextHighlights.push([]);

        for (j = 0; j < mainTextWidth; j++) {
            mainText[i] += " ";
            mainTextHighlights[i].push([0]);
        }
    }
    highlightMainTextVertical(12, 3, 16, [255, 255, 255]);
    highlightMainTextVertical(13, 3, 16, [255, 255, 255]);
    highlightMainTextHorizontal(9, 4, 22, [255, 255, 255]);

    drawOnMainText(board, -1, -1);
}

function drawOnMainText(item, xPos, yPos) {
    if (xPos == -1) {
        xPos = Math.floor((mainTextWidth - item[0].length) / 2);
    }
    if (yPos == -1) {
        yPos = Math.floor((mainTextHeight - item.length) / 2);
    }

    for (x = 0; x < item[0].length; x++) {
        for (y = 0; y < item.length; y++) {
            mainText[y + yPos] = mainText[y + yPos].substring(0, x + xPos) + item[y][x] + mainText[y + yPos].substring(x + xPos + 1);
        }
    }
}

function highlightMainText(xPos, yPos, color) {
    mainTextHighlights[yPos][xPos] = color;
}

function highlightMainTextVertical(xPos, y1, y2, color) {
    for (yPos = y1; yPos < y2; yPos++) {
        highlightMainText(xPos, yPos, color);
    }
}

function highlightMainTextHorizontal(yPos, x1, x2, color) {
    for (xPos = x1; xPos < x2; xPos++) {
        highlightMainText(xPos, yPos, color);
    }
}

function drawMainText() {
    for (i = 0; i < mainTextHeight; i++) {
        var line = document.getElementById("main-line" + i);

        line.innerHTML = "";

        for (j = 0; j < mainTextWidth; j++) {
            var color = mainTextHighlights[i][j];
            var char = mainText[i][j];

            var addition = "";
            if (color.length == 3) {
                addition += "<highlight style=\"background-color: rgb("+color[0]+","+color[1]+","+color[2]+");\">";
            }
            
            if (char == " ") {
                addition += "&nbsp;";
            } else {
                addition += mainText[i][j];
            }

            if (color.length == 3) {
                addition += "</highlight>";
            }

            line.innerHTML += addition;
        }
    }
    var paras = document.getElementsByTagName('highlight');
    for (var i = 0; i < paras.length; i++) {
        paras[i].onmouseover = function () {
            // do something like for example change the class of a div to change its color :
            document.getElementById('main-title').innerHTML += " hey";
        };
    }
}

var board = [
    "  _______   _______   _______  ",
    "/         V         V         \\",
    "|         |         |         |",
    "|         |         |         |",
    "|         |         |         |",
    " >--------+---------+--------< ",
    "|         |         |         |",
    "|         |         |         |",
    "|         |         |         |",
    "|         |         |         |",
    " >--------+---------+--------< ",
    "|         |         |         |",
    "|         |         |         |",
    "|         |         |         |",
    "\\ _______ ^ _______ ^ _______ /",
];