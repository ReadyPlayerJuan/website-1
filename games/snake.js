var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var pixelSize = 26;
var offsetX = 0;
var offsetY = 0;
var gameWidth;
var gameHeight;
var snakeSizeDifference = 1;

var newKeysDown = [];
var newKeysUp = [];
var keys = [];
var direction = 0;
var prevDirection = -1;
var snakeStartPoint = [1, 1];
var defaultSnakeLength = 5;
var snakeLength = defaultSnakeLength;
var snakeGrowth = 5;
var snakeCoordinates = [[]];

var foodCoordinates = [];

var alive = true;

var timer;

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    gameWidth = Math.floor(screenWidth / pixelSize) - 2;
    gameHeight = Math.floor(screenHeight / pixelSize) - 2 - 1;
    offsetX = (screenWidth - (gameWidth * pixelSize)) / 2;
    offsetY = (screenHeight - (gameHeight * pixelSize)) / 2;

    document.getElementById("background").style = "left: " + (0) + "px; top: " + (0) + "px; width: " + (screenWidth - (offsetX * 0)) + "px; height: " + (screenHeight - (offsetY * 0)) + "px;";
    document.getElementById("game-area").style = "left: " + ((screenWidth / 2) - ((gameWidth / 2) * pixelSize)) + "px; top: " + (offsetX) + "px; width: " + (gameWidth * pixelSize) + "px; height: " + (gameHeight * pixelSize) + "px;";
}

function startGame() {
    timer = setInterval(function () { update(); }, 80);

    snakeLength = defaultSnakeLength;
    snakeCoordinates = [];
    for (i = 0; i < snakeLength; i++) {
        snakeCoordinates.push([snakeStartPoint[0], snakeStartPoint[1]]);
    }

    randomizeFood();
    drawSnake();
}

function update() {
    for (i = snakeLength - 1; i > 0; i--) {
        snakeCoordinates[i] = [snakeCoordinates[i - 1][0], snakeCoordinates[i - 1][1]];
    }

    for (i = 0; i < newKeysDown.length; i++) {
        keys.unshift(newKeysDown[i]);
    }
    for (i = 0; i < newKeysUp.length; i++) {
        var index = -1;
        do {
            index = keys.indexOf(newKeysUp[i])
            if (index != -1) {
                keys.splice(index, 1);
            }
        } while (index != -1);
    }
    if (keys.length > 0) {
        switch (keys[0]) {
            case 0:
                if (prevDirection != 2)
                    direction = 0;
                break;
            case 1:
                if (prevDirection != 3)
                    direction = 1;
                break;
            case 2:
                if (prevDirection != 0)
                    direction = 2;
                break;
            case 3:
                if (prevDirection != 1)
                    direction = 3;
                break;
        }
    } else {
        if (keys.length > 0) {
            if (newKeysDown.length > 0) {
                switch (newKeysDown[0]) {
                    case 0:
                        if (prevDirection != 2)
                            direction = 0;
                        break;
                    case 1:
                        if (prevDirection != 3)
                            direction = 1;
                        break;
                    case 2:
                        if (prevDirection != 0)
                            direction = 2;
                        break;
                    case 3:
                        if (prevDirection != 1)
                            direction = 3;
                        break;
                }
            }
        }
    }
    newKeysDown = [];
    newKeysUp = [];
    prevDirection = direction;

    switch (direction) {
        case 0:
            snakeCoordinates[0][0] += 1;
            break;
        case 1:
            snakeCoordinates[0][1] += 1;
            break;
        case 2:
            snakeCoordinates[0][0] -= 1;
            break;
        case 3:
            snakeCoordinates[0][1] -=1;
            break;
    }

    for (i = 1; i < snakeLength; i++) {
        if (snakeCoordinates[0][0] == snakeCoordinates[i][0] && snakeCoordinates[0][1] == snakeCoordinates[i][1]) {
            alive = false;
            clearInterval(timer);
        }
    }
    if (snakeCoordinates[0][0] < 0 || snakeCoordinates[0][0] > gameWidth - 1 || snakeCoordinates[0][1] < 0 || snakeCoordinates[0][1] > gameHeight - 1) {
        alive = false;
        clearInterval(timer);
    }

    clearSnake();
    if (snakeCoordinates[0][0] == foodCoordinates[0] && snakeCoordinates[0][1] == foodCoordinates[1]) {
        for (i = 0; i < snakeGrowth; i++) {
            snakeCoordinates.push([snakeCoordinates[snakeLength - 1][0], snakeCoordinates[snakeLength - 1][1]]);
        }
        snakeLength += snakeGrowth;
        randomizeFood();
    }
    drawSnake();
}

function randomizeFood() {
    do {
        foodCoordinates = [Math.floor(Math.random() * gameWidth), Math.floor(Math.random() * gameHeight)];

        var ready = true;
        for (i = 0; i < snakeLength; i++) {
            if (foodCoordinates[0] == snakeCoordinates[i][0] && foodCoordinates[1] == snakeCoordinates[i][1]) {
                ready = false;
            }
        }
    } while (!ready);

    var block = document.getElementById("food-block");
    block.style = "left:" + (((foodCoordinates[0]+0) * pixelSize) + snakeSizeDifference) + "px; top: " + (((foodCoordinates[1]+0) * pixelSize) + snakeSizeDifference) + "px; width: " + (pixelSize - (snakeSizeDifference * 2)) + "px; height: " + (pixelSize - (snakeSizeDifference * 2)) + "px;";
}

function clearSnake() {
    for (i = 0; i < snakeLength; i++) {
        var block = document.getElementById("snake-block-" + i);
        block.parentNode.removeChild(block);
    }
}

function drawSnake() {
    for (i = 0; i < snakeLength; i++) {
        
        var t = document.createElement("div");
        t.id = "snake-block-" + i;
        t.className = "snake-block";
        t.style = "left:" + ((snakeCoordinates[i][0] * pixelSize) + snakeSizeDifference) + "px; top: " + ((snakeCoordinates[i][1] * pixelSize) + snakeSizeDifference) + "px; width: " + (pixelSize - (snakeSizeDifference * 2)) + "px; height: " + (pixelSize - (snakeSizeDifference * 2)) + "px;";
        if (i == 0 && !alive)
            t.style = "left:" + ((snakeCoordinates[i][0] * pixelSize) + snakeSizeDifference) + "px; top: " + ((snakeCoordinates[i][1] * pixelSize) + snakeSizeDifference) + "px; width: " + (pixelSize - (snakeSizeDifference * 2)) + "px; height: " + (pixelSize - (snakeSizeDifference * 2)) + "px; background-color: #B7B7B7; z-index: 5;";
        document.getElementById("game-area").appendChild(t);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        if(newKeysDown.indexOf(2) == -1)
            newKeysDown.push(2);
    } else if (event.keyCode == 39) {
        if (newKeysDown.indexOf(0) == -1)
            newKeysDown.push(0);
    } else if (event.keyCode == 40) {
        if (newKeysDown.indexOf(1) == -1)
            newKeysDown.push(1);
    } else if (event.keyCode == 38) {
        if (newKeysDown.indexOf(3) == -1)
            newKeysDown.push(3);
    }
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        if (newKeysUp.indexOf(2) == -1)
            newKeysUp.push(2);
    } else if (event.keyCode == 39) {
        if (newKeysUp.indexOf(0) == -1)
            newKeysUp.push(0);
    } else if (event.keyCode == 40) {
        if (newKeysUp.indexOf(1) == -1)
            newKeysUp.push(1);
    } else if (event.keyCode == 38) {
        if (newKeysUp.indexOf(3) == -1)
            newKeysUp.push(3);
    }
});