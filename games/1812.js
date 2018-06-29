var numIds = 0;
var numLines = 1;
var startColorProg = 0;
var charsPerLine = 65;
var colorTypeSizes = [10, 10, 10, 10, 10, 35, 13, 13, 13, 13, 5, 5, 13, 13, 30];
var colorTypeProgressions = [[0, 1, 2, 3, 4, 3, 2, 1], [13, 8, 9, 11, 6, 7, 12], [13, 14, 12], [0, 0, 0, 0, 0], [0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0, 0, 0], [0, 1, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2, 1]];
var nextColorType = 1;
var colorProgressionProgression = [3, 0, 0, 1, 4, 2, 5];
var currentColorProgression = 0;
var currentColorTypes = [colorTypeProgressions[colorProgressionProgression[currentColorProgression]][0]];
var colorTypeStartLines = [0];
var lineBlend = [5, 0, 0, 0, 5, 5];

var loaded = false;
var scrolling = false;
var stopScroll = false;

window.onLoad = textMod();
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function beginPageScroll() {
    if (!scrolling && loaded) {
        pageScroll();
        scrolling = true;
    }
}
function resetScroll() {
    stopScroll = true;
}

function textMod() {
    var oldHTML = document.getElementById("text").innerHTML.replace(/[\n\r]/g, ' ').replace('[citation needed]', '');
    for (i = 0; i < 300; i++) {
        var c = '[' + i + ']';
        oldHTML = oldHTML.replace(c, '');
    }

    var newHTML = "";
    var numOpenCarrots = 0;
    var charCount = 0;
    var idNum = 0;

    for (i = 0; i < oldHTML.length; i++) {
        if (oldHTML[i] == "<") {
            numOpenCarrots++;
            newHTML += oldHTML[i];
        } else if (oldHTML[i] == ">") {
            numOpenCarrots--;
            newHTML += oldHTML[i];
        } else if (numOpenCarrots === 0) {
            if (oldHTML[i] == " ") {
                newHTML += "&nbsp;";
            } else {
                newHTML += '<font id = "mod' + idNum + '" style="color: red;">';
                newHTML += oldHTML[i];
                newHTML += "</font>";
            }
            idNum++;
            numIds++;
        } else {
            newHTML += oldHTML[i];
        }
        charCount++;
        if (charCount >= charsPerLine) {
            charCount = 0;
            newHTML += "<br />";
            numLines++;
        }
    }
    document.getElementById("text").innerHTML = newHTML;
    recolor();
}

function recolor() {
    var currentColors = [];
    for (j = 0; j < currentColorTypes.length; j++) {
        currentColors.push([0, 0, 0]);
    }
    var startColorProg = 0.0;

    for (i = 0; i < numIds; i++) {
        var colorProg = 0;
        var lineNum = Math.floor(i / charsPerLine);
        var lineProg = (lineNum - colorTypeStartLines[0]) / colorTypeSizes[currentColorTypes[0]];
        currentColor = [0, 0, 0];

        for (j = 0; j < currentColorTypes.length; j++) {
            if (currentColorTypes.length === 1 && lineNum - colorTypeStartLines[j] >= colorTypeSizes[currentColorTypes[j]] - lineBlend[colorProgressionProgression[currentColorProgression]]) {
                currentColorTypes.push(colorTypeProgressions[colorProgressionProgression[currentColorProgression]][nextColorType]);
                nextColorType = (nextColorType + 1) % colorTypeProgressions[colorProgressionProgression[currentColorProgression]].length;
                if (nextColorType == 0) {
                    currentColorProgression = (currentColorProgression + 1) % colorProgressionProgression.length;
                }
                colorTypeStartLines.push(lineNum);
            }
            if (lineNum - colorTypeStartLines[j] >= colorTypeSizes[currentColorTypes[j]]) {
                currentColorTypes.splice(j, 1);
                colorTypeStartLines.splice(j, 1);
                j--;
            }
        }

        if ((i % charsPerLine) == 0) {
            var tune = 0.09;
            switch (currentColorTypes[0]) {
                case 2: case 6: case 7: case 8: case 9: case 12: case 13:
                    break;
                case 0:
                    startColorProg += tune;
                    break;
                case 1:
                    startColorProg += tune / 3;
                    break;
                case 3:
                    startColorProg -= tune / 3;
                    break;
                case 4:
                    startColorProg -= tune;
                    break;
                case 5:
                    startColorProg += tune / 1;
                    break;
                case 10:
                    startColorProg -= tune / 3;
                    break;
                case 11:
                    startColorProg += tune / 3;
                    break;
                case 14:
                    startColorProg += tune / 2;
                    break;
            }
            if (startColorProg >= 1)
                startColorProg--;
            if (startColorProg < 0)
                startColorProg++;
        }

        for (ja = 0; ja < currentColorTypes.length; ja++) {
            switch (currentColorTypes[ja]) {
                case 0: case 1: case 2: case 3: case 4:
                    colorProg = startColorProg + ((i % charsPerLine) / charsPerLine);
                    if (colorProg >= 1)
                        colorProg--;
                    break;
                case 5: case 10: case 11: case 14:
                    colorProg = startColorProg;
                    break;
                case 6:
                    var closenessToCenter = 1 - (Math.abs((i % charsPerLine) - (charsPerLine / 2)) / (charsPerLine / 2));
                    colorProg = startColorProg + (closenessToCenter * lineProg);
                    if (colorProg >= 1)
                        colorProg--;
                    break;
                case 7:
                    var closenessToCenter = 1 - (Math.abs((i % charsPerLine) - (charsPerLine / 2)) / (charsPerLine / 2));
                    colorProg = startColorProg + (closenessToCenter * (1 - lineProg));
                    if (colorProg >= 1)
                        colorProg--;
                    break;
                case 8:
                    var closenessToCenter = 1 - (Math.abs((i % charsPerLine) - (charsPerLine / 2)) / (charsPerLine / 2));
                    colorProg = startColorProg - (closenessToCenter * lineProg);
                    if (colorProg < 0)
                        colorProg++;
                    break;
                case 9:
                    var closenessToCenter = 1 - (Math.abs((i % charsPerLine) - (charsPerLine / 2)) / (charsPerLine / 2));
                    colorProg = startColorProg - (closenessToCenter * (1 - lineProg));
                    if (colorProg < 0)
                        colorProg++;
                    break;
                case 12:
                    var closenessToCenter =  (Math.abs((i % charsPerLine)) / (charsPerLine / 1));
                    colorProg = startColorProg + (closenessToCenter * Math.pow(lineProg, 2));
                    if (colorProg >= 1)
                        colorProg--;
                    break;
                case 13:
                    var closenessToCenter = 1 - (Math.abs((i % charsPerLine)) / (charsPerLine / 1));
                    colorProg = startColorProg - (closenessToCenter * Math.pow(1 - lineProg, 2));
                    if (colorProg < 0)
                        colorProg++;
                    break;
            }

            var newRGB = loadRGB(colorProg);
            currentColors[ja] = loadRGB(colorProg);
        }

        var character = document.getElementById("mod" + i);
        var blendProg = 1;
        if (currentColorTypes.length == 2) {
            blendProg = (lineNum - colorTypeStartLines[0] - colorTypeSizes[currentColorTypes[0]]) / ((lineBlend[colorProgressionProgression[currentColorProgression]] + 1) * -1);
        }

        if (character != null) {
            var finalColor = [0, 0, 0];
            for (k = 0; k < currentColors.length; k++) {
                if (k === 1)
                    blendProg = 1 - blendProg;

                for (l = 0; l < 3; l++) {
                    finalColor[l] += currentColors[k][l] * blendProg;
                }
            }
            for (l = 0; l < 3; l++) {
                finalColor[l] = Math.floor(finalColor[l]);
            }

            character.style.color = "rgb(" + finalColor[0] + "," + finalColor[1] + "," + finalColor[2] + ")";
        }
    }

    loaded = true;
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("text").style.visibility = "visible";
}

function loadRGB(colorProg) {
    var currentColor = [0, 0, 0];
    var allColors = [[255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [255, 0, 255]];

    var index0 = Math.floor(colorProg * allColors.length) % allColors.length;
    var index1 = (Math.floor(colorProg * allColors.length) + 1) % allColors.length;
    var prog = (colorProg * allColors.length) - index0;
    for (j = 0; j < 3; j++) {
        currentColor[j] = Math.floor((prog * allColors[index1][j]) + ((1 - prog) * allColors[index0][j]));
    }

    return currentColor;
}

function pageScroll() {
    window.scrollBy(0, 2);
    if (!stopScroll) {
        scrolldelay = setTimeout(pageScroll, 10);
    } else {
        stopScroll = false;
        scrolling = false;
        window.scrollTo(0, 0);
    }
}