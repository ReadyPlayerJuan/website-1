
var windowHTML = [];
var windowHeights = [];
var windowTransition = false;
var prevSelectedWindow = -1;
var selectedWindow = 1;

function initWindows() {
    var windows = document.getElementsByTagName("window");

    var startPoint = document.getElementById("windowStart");
    startPoint.style.position = "absolute";
    var windowTop = Number(window.getComputedStyle(startPoint, null).top.substring(0, window.getComputedStyle(startPoint, null).top.length-2));
    
    var windowMargin = Number(window.getComputedStyle(windows[0], null).marginLeft.substring(0, window.getComputedStyle(windows[0], null).marginLeft.length-2));
    
    for (i = 0; i < windows.length; i++) {
        windowHTML.push(windows[i].innerHTML);
        windowHeights.push(Number(window.getComputedStyle(windows[i], null).height.substring(0, window.getComputedStyle(windows[i], null).height.length-2)));
        
        windows[i].style.position = "absolute";
        windows[i].style.top = (windowTop - windowMargin + 10) + "px";
    }

    formatWindows()
}

function formatWindows() {
    var windows = document.getElementsByTagName("window");

    var windowAreaWidth = document.getElementById("message").clientWidth - 20;
    var minWindowWidth = 36.0;
    var maxWindowWidth = windowAreaWidth - (minWindowWidth * (windows.length - 1));
    var windowPadding = window.getComputedStyle(windows[0], null).paddingLeft.substring(0, 1);
    var windowMargin = Number(window.getComputedStyle(windows[0], null).marginLeft.substring(0, 1));
    var currentX = (window.innerWidth / 2) - (windowAreaWidth / 2) + windowMargin;
    var htmlFadeTime = 0.12;

    for (i = 0; i < windows.length; i++) {
        var windowWidth = 0;
        var windowHeight = 0;

        if (!windowTransition) {

            windowHeight = windowHeights[selectedWindow];
            if (i == selectedWindow) {
                for (c = 0; c < windows[i].getElementsByTagName("p").length; c++) {
                    windows[i].getElementsByTagName("p")[c].style.opacity = "1.0";
                }
                for (c = 0; c < windows[i].getElementsByTagName("img").length; c++) {
                    windows[i].getElementsByTagName("img")[c].style.opacity = "1.0";
                }
                windowWidth = maxWindowWidth;
            } else {
                for (c = 0; c < windows[i].getElementsByTagName("p").length; c++) {
                    windows[i].getElementsByTagName("p")[c].style.opacity = "0.0";
                }
                for (c = 0; c < windows[i].getElementsByTagName("img").length; c++) {
                    windows[i].getElementsByTagName("img")[c].style.opacity = "0.0";
                }
                windowWidth = minWindowWidth;
            }
        } else {
            var opacity = 0.0;

            windowHeight = (timerProgress * windowHeights[selectedWindow]) + ((1 - timerProgress) * windowHeights[prevSelectedWindow]);
            if (i == prevSelectedWindow) {
                windowWidth = (timerProgress * minWindowWidth) + ((1 - timerProgress) * maxWindowWidth);
                opacity = 1 - Math.max(0, Math.min(1, (timerProgress / htmlFadeTime)));
            } else if (i == selectedWindow) {
                windowWidth = (timerProgress * maxWindowWidth) + ((1 - timerProgress) * minWindowWidth);
                opacity = 1 - Math.max(0, Math.min(1, ((1 - timerProgress) / htmlFadeTime)));
            } else {
                windowWidth = minWindowWidth;
            }

            for (c = 0; c < windows[i].getElementsByTagName("p").length; c++) {
                windows[i].getElementsByTagName("p")[c].style.opacity = String(opacity);
            }
            for (c = 0; c < windows[i].getElementsByTagName("img").length; c++) {
                windows[i].getElementsByTagName("img")[c].style.opacity = String(opacity);
            }
        }

        windows[i].style.width = (windowWidth - (windowPadding * 2) - (windowMargin * 2)) + "px";
        windows[i].style.height = (windowHeight) + "px";

        windows[i].style.left = (currentX - windowMargin) + "px";
        currentX += windowWidth;
    }
}


function initButtons() {
    var button0 = document.getElementById("button0");
    button0.addEventListener("click", function () { selectWindow(0) });

    var button1 = document.getElementById("button1");
    button1.addEventListener("click", function () { selectWindow(1) });

    var button2 = document.getElementById("button2");
    button2.addEventListener("click", function () { selectWindow(2) });

    buttons = [button0, button1, button2];
    selectWindow(0);
    frameCount = 9999;

    function selectWindow(index) {
        if (!windowTransition && index != selectedWindow) {
            buttons[selectedWindow].style.background = "orangered";
            buttons[index].style.background = "salmon";

            prevSelectedWindow = selectedWindow;
            selectedWindow = index;

            frameCount = 0;
            timer = setInterval(function () { updateWindow(); }, timerResolution);
            windowTransition = true;
        }
    }
}

var timer;
var timerResolution = 4;
var windowTransitionLength = 0.4;
var timerProgress = 0.0;
var frameCount = 0;
function updateWindow() {
    frameCount++;
    timerProgress = Math.min(1, frameCount / ((windowTransitionLength * 1000) / timerResolution));
    timerProgress -= 0.5;
    var secondHalf = timerProgress >= 0;
    timerProgress *= 2;
    timerProgress = Math.abs(timerProgress);
    timerProgress = 1 - timerProgress;
    timerProgress = Math.pow(timerProgress, 3.5);
    timerProgress = 1 - timerProgress;
    if (!secondHalf)
        timerProgress *= -1;
    timerProgress /= 2;
    timerProgress += 0.5;

    if (timerProgress >= 1) {
        timerProgress = 1;
        clearInterval(timer);
        windowTransition = false;
    }

    formatWindows();
}