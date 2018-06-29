var sandCount = 100;
var timer;

var size = 15;
var piles = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var colors = ["rgba(0,0,0,0)", "rgb(255,0,0)", "rgb(255,128,0)", "rgb(255,255,0)", "rgb(0,255,0)"]

var speed = "slow";
var numPixels = 51;
var start = false;
var finished = false;

function update() {
    if (start) {
        clear();
        console.log(speed + " " + finished);
        if (speed == "instant") {
            while (!finished) {
                calculate();
            }
        } else {
            calculate();
        }
        draw();
    }
}

function calculate() {
    var newPiles = [];
    for (i = 0; i < piles.length; i++) {
        newPiles.push([]);
        for (j = 0; j < piles[0].length; j++) {
            newPiles[i].push(0);
        }
    }

    for (y = 0; y < piles.length; y++) {
        for (x = 0; x < piles[0].length; x++) {
            if(piles[y][x] >= 4) {
                piles[y][x] -= 4;

                if(x != 0)
                    newPiles[y][x-1]++;
                if(y != 0)
                    newPiles[y-1][x]++;
                if(x != piles[0].length-1)
                    newPiles[y][x+1]++;
                if(y != piles.length-1)
                    newPiles[y+1][x]++;
            }
        }
    }
    
    finished = true;
    for (y = 0; y < piles.length; y++) {
        for (x = 0; x < piles[0].length; x++) {
            piles[y][x] += newPiles[y][x];
            if (piles[y][x] >= 4)
                finished = false;
        }
    }

    if (finished) {
        start = false;
    }

    var added = false;
    for (y = 0; y < piles.length; y++) {
        for (x = 0; x < piles[0].length; x++) {
            if (!added && piles[y][x] != 0 && (x == 0 || y == 0 || x == piles[0].length-1 || y == piles.length-1)) {
                added = true;

                for (i = 0; i < piles.length; i++) {
                    piles[i].unshift(0);
                    piles[i].push(0);
                }
                piles.unshift([]);
                piles.push([]);
                for (i = 0; i < piles[1].length; i++) {
                    piles[0].push(0);
                    piles[piles.length - 1].push(0);
                }
            }
        }
    }
    console.log(piles.length + " " + piles[3].length);
}

function clear() {
    for (y = 0; y < piles.length; y++) {
        for (x = 0; x < piles[0].length; x++) {
            var block = document.getElementById("block" + x + "-" + y);
            document.getElementById("drawArea").removeChild(block);
        }
    }
}

function draw() {
    for (y = 0; y < piles.length; y++) {
        for (x = 0; x < piles[0].length; x++) {
            var block = document.createElement("div");
            block.className = "sandPile";
            block.id = "block" + x + "-" + y;
            block.style = "left: " + (((x - (piles[0].length / 2)) * size) + (window.innerWidth / 2)) + "px; top: " + (((y - (piles.length / 2)) * size) + (window.innerHeight / 2)) + "px; width: " + size + "px; height: " + size + "px; background: " + colors[Math.min(4, piles[y][x])] + ";";
            document.getElementById("drawArea").appendChild(block);
        }
    }
}

function initButtons() {
    document.getElementById("-100").addEventListener("click", function () { changeSandCount(-100); });

    document.getElementById("-10").addEventListener("click", function () { changeSandCount(-10); });

    document.getElementById("-1").addEventListener("click", function () { changeSandCount(-1); });

    document.getElementById("+1").addEventListener("click", function () { changeSandCount(1); });

    document.getElementById("+10").addEventListener("click", function () { changeSandCount(10); });

    document.getElementById("+100").addEventListener("click", function () { changeSandCount(100); });

    document.getElementById("slow").addEventListener("click", function () { setTimerSpeed("slow"); });

    document.getElementById("fast").addEventListener("click", function () { setTimerSpeed("fast"); });

    document.getElementById("instant").addEventListener("click", function () { setTimerSpeed("instant"); });

    document.getElementById("add").addEventListener("click", function () { addSand(); });

    setTimerSpeed("slow");
    draw();
}

function setTimerSpeed(s) {
    clearInterval(timer);

    if (s == "slow") {
        document.getElementById("speed").innerHTML = "slow";
        speed = "slow";
        timer = setInterval(function () { update(); }, 300);
    } else if (s == "fast") {
        document.getElementById("speed").innerHTML = "fast";
        speed = "fast";
        timer = setInterval(function () { update(); }, 75);
    } else if (s == "instant") {
        document.getElementById("speed").innerHTML = "instant";
        speed = "instant";
        timer = setInterval(function () { update(); }, 0);
    }
}

function changeSandCount(delta) {
    sandCount += delta;

    document.getElementById("sandCount").innerHTML = String(sandCount);
}

function addSand() {
    start = true;
    finished = false;
    piles[Math.floor(piles.length / 2)][Math.floor(piles[0].length / 2)] += sandCount;
}