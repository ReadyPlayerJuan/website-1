var currentOptionSetIndex = 0;
var allOptions = ["projects", "about", "other", "other2", "other3", "other4"];
var optionTransitionTargets = ["", "", "testFolder/testPage2.html", "games/snake.html", "", ""];

var cycleValue = 0;

function initOptions() {
    var top = 0;
    var windowAreaStyle = window.getComputedStyle(document.getElementById("options"), null);
    var windowAreaWidth = windowAreaStyle.width.substring(0, windowAreaStyle.width.length - 2);
    var optionWidth = windowAreaWidth / 2;
    var optionHeight = optionWidth;
    var optionBorderSize = 8;

    document.getElementById("options").style.width = windowAreaWidth;
    document.getElementById("options").style.height = windowAreaWidth * (3 / 2);

    for (setNum = 0; setNum < allOptions.length; setNum++) {

    }

    initButtons();
}

function initButtons() {
    for (optionNum = 0; optionNum < allOptions[currentOptionSetIndex].length; optionNum++) {
        var b = document.getElementById(allOptions[optionNum]);

        if (optionNum == 0) {
            b.addEventListener("click", function () { chooseOption(0) });
        } else if (optionNum == 1) {
            b.addEventListener("click", function () { chooseOption(1) });
        } else if (optionNum == 2) {
            b.addEventListener("click", function () { chooseOption(2) });
        } else if (optionNum == 3) {
            b.addEventListener("click", function () { chooseOption(3) });
        } else if (optionNum == 4) {
            b.addEventListener("click", function () { chooseOption(4) });
        } else if (optionNum == 5) {
            b.addEventListener("click", function () { chooseOption(5) });
        }
    }

    function chooseOption(index) {
        if (optionTransition == false) {
            transitionTarget = optionTransitionTargets[currentOptionSetIndex][index];
            
            if (transitionTarget.length > 2) {
                document.location.href = transitionTarget;
            }
        }
    }
}