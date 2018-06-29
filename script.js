var numIds = 0;
var startColorProg = 0;
document.getElementsByTagName("rainbowButton")[0].onclick = function () { if (numIds === 0) { textMod(); } };

function textMod() {
    document.getElementsByTagName("rainbowButton")[0].innerHTML = "<p>what did<br />I just say</p>";
    var oldHTML = document.getElementById("mod").innerHTML;

    var newHTML = "";
    var numOpenCarrots = 0;
    var idNum = 0;

    for (i = 0; i < oldHTML.length; i++) {
        if (oldHTML[i] == "<") {
            numOpenCarrots++;
            newHTML += oldHTML[i];
        } else if (oldHTML[i] == ">") {
            numOpenCarrots--;
            newHTML += oldHTML[i];
        } else if (numOpenCarrots === 0 && oldHTML[i] != " ") {
            newHTML += '<font id = "text' + idNum + '" style="color: red;">';
            newHTML += oldHTML[i];
            newHTML += "</font>";
            idNum++;
            numIds++;
        } else {
            newHTML += oldHTML[i];
        }
    }
    document.getElementById("mod").innerHTML = newHTML;
    setInterval(function () { recolor(); }, 17);
}

function recolor() {
    startColorProg -= 0.020011;
    if (startColorProg < 0)
        startColorProg++;
    var currentColor = [0, 0, 0];
    var allColors = [[255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [255, 0, 255]];
    var colorProg = startColorProg;
    var colorProgAdvance = 0.04;
    for (i = 0; i < numIds; i++) {
        colorProg += colorProgAdvance;
        if (colorProg > 1)
            colorProg--;
        var index0 = Math.floor(colorProg * allColors.length);
        var index1 = (Math.floor(colorProg * allColors.length) + 1) % allColors.length;
        var prog = (colorProg * allColors.length) - index0;
        for (j = 0; j < 3; j++) {
            currentColor[j] = Math.floor((prog * allColors[index1][j]) + ((1 - prog) * allColors[index0][j]));
        }
        document.getElementById("text" + i).style.color = "rgb(" + currentColor[0] + "," + currentColor[1] + "," + currentColor[2] + ")";
    }

    for (i = 0; i < document.getElementsByClassName("buttons").length; i++) {
        colorProg += colorProgAdvance * 3;
        if (colorProg > 1)
            colorProg--;
        var index0 = Math.floor(colorProg * allColors.length);
        var index1 = (Math.floor(colorProg * allColors.length) + 1) % allColors.length;
        var prog = (colorProg * allColors.length) - index0;
        for (j = 0; j < 3; j++) {
            currentColor[j] = Math.floor((prog * allColors[index1][j]) + ((1 - prog) * allColors[index0][j]));
        }
        document.getElementsByClassName("buttons")[i].style.backgroundColor = "rgb(" + currentColor[0] + "," + currentColor[1] + "," + currentColor[2] + ")";
        document.getElementsByClassName("buttons")[i].style.borderColor = "rgb(" + currentColor[0] + "," + currentColor[1] + "," + currentColor[2] + ")";
    }
}