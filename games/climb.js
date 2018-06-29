var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var size = (screenWidth + screenHeight) / 2;
var keys = [];
var prevKeys = [];
var ctx;
var timer;


var screenElevation = 0;
var lavaElevation = 0;
var minLavaElevationSpeed = size / 2100;

var fallingBlocks = [];
var stillBlocks = [[0, screenHeight, screenWidth, 0, 255, 0, 0], [0, screenHeight, screenWidth, 60, 0, 255, 0]];
var totalBlocks = 0;
var numBlocksToMaxSpeed = 75;
var maxFramesPerBlock = 62;
var minFramesPerBlock = 30;
var currentNumFramesPerBlock = maxFramesPerBlock;
var blockFallSpeed = size / 270;
var blockSpawnFrameCount = 0;
var minBlockWidth = Math.floor(size / 15), maxBlockWidth = Math.floor(size / 9);
var minBlockHeight = minBlockWidth, maxBlockHeight = maxBlockWidth;
var blockColors = [[255,0,0],[255,127,0],[255,255,0],[0,255,0],[0,0,255],[255,0,255]];
var numBlocksForColorRotation = 100;

var playerDead = false;
var paused = false;
var unpausable = false;
var numPlayerDeathFrames = 0;
var numPlayerDeathParticles = 20;
var playerDeathParticles = [];
var playerDeathParticleLifetime = 110;

var playerAccel = size / 1300;
var playerJumpAccel = size / -85;
var playerGravity = size / 1700;
var playerXVel = 0, playerYVel = 0;
var playerWidth = Math.floor(size / 20), playerHeight = Math.floor(size / 17);
var playerX = (screenWidth - playerWidth) / 2, playerY = screenHeight - 60;
var playerOnGround = false, playerOnRight = false, playerOnLeft = false, playerPrevOnGround = false, playerPrevOnRight = false, playerPrevOnLeft = false, playerOnFallingBlock = false, playerPrevOnFallingBlock = false;
var framesOnLeft = 0, framesOnRight = 0;

setInterval(function () { document.getElementById("score").innerHTML = "Score: " + Math.floor(screenElevation / 75); }, 100);

function loadCanvas() {
    var canvas = document.getElementById("gameScreen");
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.width = screenWidth + "px";
    canvas.style.height = screenHeight + "px";

    ctx = canvas.getContext("2d");
    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
}

function resize() {
    var canvas = document.getElementById("gameScreen");
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx = canvas.getContext("2d");
    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
    draw();
}

function initButtons() {
    document.getElementById("start").addEventListener("click", function () { startGame(); });
    document.getElementById("restart").addEventListener("click", function () { startGame(); });
    document.getElementById("unpause").addEventListener("click", function () {
        document.getElementById("pauseScreen").style.visibility = "hidden";
        unpausable = false;
        paused = false;
    });
}

function startGame() {
    fallingBlocks = [];
    playerDeathParticles = [];
    numPlayerDeathFrames = 0;
    totalBlocks = 0;
    stillBlocks = [[0, screenHeight, screenWidth, 0, 255, 0, 0], [0, screenHeight, screenWidth, 60, 0, 255, 0]];
    playerX = (screenWidth - playerWidth) / 2;
    playerY = screenHeight - 60;
    screenElevation = 0;
    lavaElevation = screenHeight * -1.4;
    playerXVel = 0;
    playerYVel = 0;

    document.getElementById("startScreen").style.visibility = "hidden";
    document.getElementById("deathScreen").style.visibility = "hidden";
    document.getElementById("pauseScreen").style.visibility = "hidden";

    playerDead = false;
    numPlayerDeathFrames = 0;

    clearInterval(timer);
    timer = setInterval(function () { update(); }, 17);
}

function update() {
    console.log(paused);
    if (!paused) {
        blockSpawnFrameCount++;
        if (blockSpawnFrameCount >= currentNumFramesPerBlock && lavaElevation - screenElevation < screenHeight) {
            spawnBlock();

            totalBlocks++;
            blockSpawnFrameCount = 0;
            currentNumFramesPerBlock = minFramesPerBlock + ((maxFramesPerBlock - minFramesPerBlock) * (1 - Math.min(1, Math.max(0, (totalBlocks / numBlocksToMaxSpeed)))));
            currentNumFramesPerBlock = Math.floor(currentNumFramesPerBlock * ((Math.random() * 0.8) + 0.6));
        }

        if (!playerDead)
            updatePlayer();
        updateBlocks();
        updateScreenPosition();

        if (playerDead)
            numPlayerDeathFrames++;
    }

    if (keys.indexOf(32) != -1 && !playerDead) {
        if (!paused && unpausable) {
            document.getElementById("pauseScreen").style.visibility = "visible";
            unpausable = false;
            paused = true;
        } else if (paused && unpausable) {
            document.getElementById("pauseScreen").style.visibility = "hidden";
            unpausable = false;
            paused = false;
        }
    } else if (keys.indexOf(32) == -1) {
        unpausable = true;
    }

    draw();
}

function draw() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(-0, 0, screenWidth+0, screenHeight);


    ctx.fillStyle = "rgb(127, 127, 255)";
    if (!playerDead) {
        ctx.fillRect(playerX, playerY - playerHeight + screenElevation, playerWidth, playerHeight);
        if (playerX + playerWidth > screenWidth) {
            ctx.fillRect(playerX - screenWidth, playerY - playerHeight + screenElevation, playerWidth, playerHeight);
        }
    }

    for (i = 0; i < fallingBlocks.length; i++) {
        drawBlock(fallingBlocks[i]);
    }
    for (i = stillBlocks.length - 1; i >= 0; i--) {
        if (i == 0)
            ctx.fillStyle = "rgb(255,0,0)";
        drawBlock(stillBlocks[i]);
    }

    if(playerDeathParticles.length > 0 && numPlayerDeathFrames < playerDeathParticleLifetime)
        drawDeathParticles();

    function drawBlock(blockData) {
        ctx.fillStyle = "rgb("+blockData[4]+", "+blockData[5]+", "+blockData[6]+")";
        ctx.fillRect(blockData[0], blockData[1] - blockData[3] + screenElevation, blockData[2], blockData[3]);
        if (blockData[0] + blockData[2] > screenWidth) {
            ctx.fillRect(blockData[0] - screenWidth, blockData[1] - blockData[3] + screenElevation, blockData[2], blockData[3]);
        }
    }
}

function updateScreenPosition() {
    var relativePlayerHeight = screenHeight - playerY - screenElevation;
    if (relativePlayerHeight > screenHeight / 3) {
        screenElevation += (relativePlayerHeight - (screenHeight / 3)) / 100;
    }

    var speedMod = (3*Math.max(0, Math.min(1, (screenElevation - lavaElevation) / 150))) + 1
    lavaElevation += (minLavaElevationSpeed * speedMod);

    if (lavaElevation > (screenHeight - playerY)) {
        killPlayer();
    }
}

function updatePlayer() {
    if ((keys.indexOf(37) != -1 || keys.indexOf(65) != -1) && ((keys.indexOf(39) == -1 && keys.indexOf(68) == -1) || (keys.indexOf(37) > keys.indexOf(39) || keys.indexOf(65) > keys.indexOf(68)))) {
        playerXVel -= playerAccel;
    } else if ((keys.indexOf(39) != -1 || keys.indexOf(68) != -1) && ((keys.indexOf(37) == -1 && keys.indexOf(65) == -1) || (keys.indexOf(39) > keys.indexOf(37) || keys.indexOf(68) > keys.indexOf(65)))) {
        playerXVel += playerAccel;
    }
    if ((playerOnGround || (playerOnLeft && framesOnLeft > 3) || (playerOnRight && framesOnRight > 3)) && (keys.indexOf(38) != -1 || keys.indexOf(87) != -1)) {
        if (playerOnGround) {
            playerYVel = playerJumpAccel;
        } else if (playerOnLeft) {
            playerYVel = playerJumpAccel;
            playerXVel = playerJumpAccel * -0.8;
        } else if (playerOnRight) {
            playerYVel = playerJumpAccel;
            playerXVel = playerJumpAccel * 0.8;
        }
    }


    playerPrevOnGround = playerOnGround;
    playerPrevOnLeft = playerOnLeft;
    playerPrevOnRight = playerOnRight;
    playerPrevOnFallingBlock = playerOnFallingBlock;
    if (playerOnLeft && !playerOnGround)
        framesOnLeft++;
    else
        framesOnLeft = 0;
    if (playerOnRight && !playerOnGround)
        framesOnRight++;
    else
        framesOnRight = 0;

    playerOnGround = false;
    playerOnLeft = false;
    playerOnRight = false;
    playerOnFallingBlock = false;

    var nextX = playerX + playerXVel;
    var nextY = playerY + playerYVel;

    for (i = 0; i < fallingBlocks.length; i++) {
        checkforCollisionWith(fallingBlocks[i], true);

        if (fallingBlocks[i][0] - screenWidth + fallingBlocks[i][2] >= nextX) {
            fallingBlocks[i][0] -= screenWidth;
            checkforCollisionWith(fallingBlocks[i], true);
            fallingBlocks[i][0] += screenWidth;
        } else if (fallingBlocks[i][0] + screenWidth <= nextX + playerWidth) {
            fallingBlocks[i][0] += screenWidth;
            checkforCollisionWith(fallingBlocks[i], true);
            fallingBlocks[i][0] -= screenWidth;
        }
    }
    for (i = stillBlocks.length-1; i >= 0; i--) {
        checkforCollisionWith(stillBlocks[i], false);

        if (stillBlocks[i][0] - screenWidth + stillBlocks[i][2] >= nextX) {
            stillBlocks[i][0] -= screenWidth;
            checkforCollisionWith(stillBlocks[i], false);
            stillBlocks[i][0] += screenWidth;
        } else if (stillBlocks[i][0] + screenWidth <= nextX + playerWidth) {
            stillBlocks[i][0] += screenWidth;
            checkforCollisionWith(stillBlocks[i], false);
            stillBlocks[i][0] -= screenWidth;
        }
    }

    playerX = nextX;
    playerY = nextY;

    playerXVel *= 0.9;
    playerYVel += playerGravity;
    if ((playerOnLeft && (keys.indexOf(37) != -1 || keys.indexOf(65) != -1)) || (playerOnRight && (keys.indexOf(39) != -1 || keys.indexOf(68) != -1))) {
        if (playerOnFallingBlock) {
            playerYVel = Math.min(playerGravity * 2 + blockFallSpeed, playerYVel);
        } else {
            playerYVel = Math.min(playerGravity * 2, playerYVel);
        }
    }
    if (playerX > screenWidth) {
        playerX -= screenWidth;
        playerY -= 1;
    } else if (playerX < 0) {
        playerX += screenWidth;
    }

    prevKeys = [];
    for (i = 0; i < keys.length; i++) {
        prevKeys.push(keys[i]);
    }


    function checkforCollisionWith(blockData, falling) {
        if (nextX + playerWidth > blockData[0] && nextX < blockData[0] + blockData[2]) {
            if (playerYVel > 0) {
                if (nextY >= blockData[1] - blockData[3] && nextY - playerHeight <= blockData[1] && ((playerPrevOnGround && playerPrevOnFallingBlock) || !(playerY > blockData[1] - blockData[3])) && Math.abs(blockData[1] - blockData[3] - playerY) < Math.abs(playerYVel * 2)) {
                    nextY = blockData[1] - blockData[3];
                    playerOnGround = true;

                    if (falling) {
                        playerYVel = blockFallSpeed;
                        nextY += blockFallSpeed;
                        playerOnFallingBlock = true;
                    } else {
                        playerYVel = 0;
                    }

                    if (blockData == stillBlocks[0]) {
                        killPlayer();
                    }
                }
            }
            if (playerYVel < 0 || (falling && playerYVel < blockFallSpeed)) {
                if (nextY - playerHeight <= blockData[1] && nextY - playerHeight >= blockData[1] - blockData[3] && !(playerY - playerHeight + blockFallSpeed < blockData[1])) {
                    nextY = blockData[1] + playerHeight;

                    if (falling) {
                        playerYVel = blockFallSpeed;
                        nextY += blockFallSpeed;
                        playerOnFallingBlock = true;

                        if (playerOnGround || playerPrevOnGround) {
                            killPlayer();
                        }
                    } else {
                        playerYVel = 0;
                    }
                }
            }
        }

        if (nextY > blockData[1] - blockData[3] && nextY - playerHeight < blockData[1]) {
            if (playerXVel > 0) {
                if (nextX + playerWidth >= blockData[0] && nextX <= blockData[0] + blockData[2] && !(playerX + playerWidth > blockData[0])) {
                    nextX = blockData[0] - playerWidth;

                    if(keys.indexOf(37) == -1)
                        playerOnRight = true;
                    if (falling)
                        playerOnFallingBlock = true;

                    playerXVel = 0;
                }
            } else if (playerXVel < 0) {
                if (nextX + playerWidth >= blockData[0] && nextX <= blockData[0] + blockData[2] && !(playerX < blockData[0] + blockData[2])) {
                    nextX = blockData[0] + blockData[2];

                    if (keys.indexOf(39) == -1)
                        playerOnLeft = true;
                    if (falling)
                        playerOnFallingBlock = true;

                    playerXVel = 0;
                }
            }
        }
    }
}

function drawDeathParticles() {
    ctx.fillStyle = "rgba(127, 127, 255, " + (1 - (numPlayerDeathFrames / playerDeathParticleLifetime)) + ")";
    for (i = 0; i < playerDeathParticles.length; i++) {
        var angle = 3.14159 * 2 * playerDeathParticles[i][3];
        var speed = 3.0 * playerDeathParticles[i][4] * (1 - (numPlayerDeathFrames / playerDeathParticleLifetime));
        playerDeathParticles[i][0] += speed * Math.cos(angle);
        playerDeathParticles[i][1] += (speed / 3) * Math.sin(angle);
        ctx.fillRect(playerDeathParticles[i][0], playerDeathParticles[i][1] - playerDeathParticles[i][2] + screenElevation, playerDeathParticles[i][2], playerDeathParticles[i][2]);
    }
}

function killPlayer() {
    if (!playerDead) {
        document.getElementById("deathScreen").style.visibility = "visible";
        document.getElementById("deathScreenScore").innerHTML = "Score: " + Math.floor(screenElevation / 75);

        playerDead = true;

        playerDeathParticles = [];
        var particleSize = Math.floor(playerWidth / 4);
        for (i = 0; i < numPlayerDeathParticles; i++) {
            playerDeathParticles.push([playerX + Math.floor(Math.random() * (playerWidth - particleSize)), playerY - Math.floor(Math.random() * (playerHeight - particleSize)), particleSize, i/numPlayerDeathParticles + (Math.random() * 0.2) - 0.1, (Math.random() * 1.8) + 0.3]);
        }
    }
}

function spawnBlock() {
    var colorProg = (totalBlocks / numBlocksForColorRotation) + (Math.random() * 0.15) - 0.075 + 1;
    while (colorProg > 1) {
        colorProg--;
    }
    colorProg *= blockColors.length;
    var prog = colorProg - Math.floor(colorProg);
    var color0 = Math.floor(colorProg);
    var color1 = (color0 + 1) % blockColors.length;

    var newBlock = [Math.floor(Math.random() * screenWidth), -screenElevation, Math.floor(minBlockWidth + (Math.random() * (maxBlockWidth - minBlockWidth))),
            Math.floor(minBlockHeight + (Math.random() * (maxBlockHeight - minBlockHeight))),
            Math.floor(((1 - prog) * blockColors[color0][0]) + (prog * blockColors[color1][0])),
            Math.floor(((1 - prog) * blockColors[color0][1]) + (prog * blockColors[color1][1])),
            Math.floor(((1 - prog) * blockColors[color0][2]) + (prog * blockColors[color1][2]))];
    var overlap = false;
    for (i = 0; i < fallingBlocks.length; i++) {
        if(!overlap && ((newBlock[0] <= fallingBlocks[i][0] + fallingBlocks[i][2] && newBlock[0] + newBlock[2] >= fallingBlocks[i][0] &&
            newBlock[1] - newBlock[3] <= fallingBlocks[i][1] && newBlock[1] >= fallingBlocks[i][1] - fallingBlocks[i][3]) || 
               (newBlock[0] + screenWidth <= fallingBlocks[i][0] + fallingBlocks[i][2] && newBlock[0] + newBlock[2] + screenWidth >= fallingBlocks[i][0] &&
            newBlock[1] - newBlock[3] <= fallingBlocks[i][1] && newBlock[1] >= fallingBlocks[i][1] - fallingBlocks[i][3]) ||
                (newBlock[0] - screenWidth <= fallingBlocks[i][0] + fallingBlocks[i][2] && newBlock[0] + newBlock[2] - screenWidth >= fallingBlocks[i][0] &&
            newBlock[1] - newBlock[3] <= fallingBlocks[i][1] && newBlock[1] >= fallingBlocks[i][1] - fallingBlocks[i][3]))) {
            overlap = true;
        }
    }

    if (!overlap) {
        fallingBlocks.push(newBlock);
    }
}

function updateBlocks() {
    for (i = 0; i < fallingBlocks.length; i++) {
        fallingBlocks[i][1] += blockFallSpeed;

        var finished = false;
        for (j = 0; j < stillBlocks.length; j++) {
            if (!finished && ((fallingBlocks[i][0] + fallingBlocks[i][2] > stillBlocks[j][0] && fallingBlocks[i][0] < stillBlocks[j][0] + stillBlocks[j][2]) ||
                    (fallingBlocks[i][0] + fallingBlocks[i][2] - screenWidth > stillBlocks[j][0] && fallingBlocks[i][0] - screenWidth < stillBlocks[j][0] + stillBlocks[j][2]) || 
                    (fallingBlocks[i][0] + fallingBlocks[i][2] + screenWidth > stillBlocks[j][0] && fallingBlocks[i][0] + screenWidth < stillBlocks[j][0] + stillBlocks[j][2]))) {
                if (fallingBlocks[i][1] >= stillBlocks[j][1] - stillBlocks[j][3] && fallingBlocks[i][1] - fallingBlocks[i][3] <= stillBlocks[j][1]) {
                    fallingBlocks[i][1] = stillBlocks[j][1] - stillBlocks[j][3];
                    stillBlocks.push(fallingBlocks[i]);
                    fallingBlocks.splice(i, 1);
                    i--;
                    finished = true;
                }
            }
        }
    }

    for (i = 1; i < stillBlocks.length; i++) {
        if (stillBlocks[i][1] - stillBlocks[i][3] + screenElevation > screenHeight * 1) {
            stillBlocks.splice(i, 1);
            i--;
        }
    }
    stillBlocks[0] = [0, screenHeight - screenElevation + playerHeight, screenWidth, Math.max(0, lavaElevation - screenElevation + playerHeight), 0];
}

document.addEventListener('keydown', function (event) {
    if(keys.indexOf(event.keyCode) == -1)
        keys.push(event.keyCode);
});

document.addEventListener('keyup', function (event) {
    var removeIndex = -1;
    removeIndex = keys.indexOf(event.keyCode);

    if (removeIndex != -1) {
        keys.splice(removeIndex, 1);
    }
});