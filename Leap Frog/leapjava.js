
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Low-resolution drawing surface
const pixelCanvas = document.createElement("canvas");
pixelCanvas.width = 400;
pixelCanvas.height = 125;

const p = pixelCanvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// Game settings
let isPlaying = true;
let gravity = 0.35;
let gameSpeed = 2.5;
let score = 0;
let frame = 0;

const groundY = 105;

// Pixel frog
const frog = {
    x: 30,
    y: 81,
    width: 24,
    height: 24,
    velocityY: 0,
    isJumping: false,
    jumpStrength: -6
};

// Pixel-art sprite
const frogPixels = [
    "....GGGG....",
    "..GGGGGGGG..",
    ".GGWWGGWWGG.",
    ".GGKKGGKKGG.",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGDDDDDDGGG",
    ".GGDDDDDDGG.",
    "..GGGGGGGG..",
    ".GGGGGGGGGG.",
    "GGG......GGG",
    "GG........GG"
];

const colors = {
    G: "#49b936",
    D: "#98e65b",
    W: "#ffffff",
    K: "#161616"
};

let obstacles = [];

function spawnObstacle() {
    if (!isPlaying) return;

    obstacles.push({
        x: pixelCanvas.width,
        y: groundY - 18,
        width: 18,
        height: 18
    });
}

setInterval(spawnObstacle, 2000);

// Controls
window.addEventListener("keydown", function(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();

        if (!isPlaying) {
            restartGame();
            return;
        }

        if (!frog.isJumping) {
            frog.velocityY = frog.jumpStrength;
            frog.isJumping = true;
        }
    }
});

// Draw pixel-art background
function drawBackground() {

    // Sky
    p.fillStyle = "#75d7ff";
    p.fillRect(0, 0, 400, 125);

    // Sun
    p.fillStyle = "#ffdf40";
    p.fillRect(340, 12, 24, 24);

    // Pixel clouds
    p.fillStyle = "#ffffff";

    for (let i = 0; i < 3; i++) {
        let x = ((i * 150 - frame * 0.3) % 500 + 500) % 500;

        p.fillRect(x, 20, 35, 8);
        p.fillRect(x + 8, 12, 20, 8);
        p.fillRect(x + 5, 28, 30, 4);
    }

    // Distant hills
    p.fillStyle = "#8ed46a";

    for (let i = 0; i < 5; i++) {
        let x = i * 100;

        p.fillRect(x, 80, 90, 25);
        p.fillRect(x + 15, 70, 60, 10);
        p.fillRect(x + 30, 60, 30, 10);
    }

    // Grass
    p.fillStyle = "#49b936";
    p.fillRect(0, groundY, 400, 20);

    // Dark grass border
    p.fillStyle = "#237622";
    p.fillRect(0, groundY, 400, 3);

    // Moving ground details
    p.fillStyle = "#287d29";

    for (let i = 0; i < 20; i++) {
        let x = ((i * 25 - frame * gameSpeed) % 400 + 400) % 400;
        p.fillRect(x, 113, 6, 2);
    }
}

// Draw frog using pixel sprite
function drawFrog() {
    const pixelSize = 2;

    for (let row = 0; row < frogPixels.length; row++) {
        for (let col = 0; col < frogPixels[row].length; col++) {

            let pixel = frogPixels[row][col];

            if (colors[pixel]) {
                p.fillStyle = colors[pixel];

                p.fillRect(
                    Math.round(frog.x + col * pixelSize),
                    Math.round(frog.y + row * pixelSize),
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

// Draw pixel mushroom
function drawMushroom(obs) {

    let x = Math.round(obs.x);
    let y = Math.round(obs.y);

    // Stem
    p.fillStyle = "#fff2d0";
    p.fillRect(x + 6, y + 8, 6, 10);

    // Mushroom cap
    p.fillStyle = "#b52323";
    p.fillRect(x + 3, y + 4, 12, 8);
    p.fillRect(x + 6, y, 6, 4);

    // Highlights
    p.fillStyle = "#ff6254";
    p.fillRect(x + 3, y + 4, 12, 4);

    // White spots
    p.fillStyle = "#ffffff";
    p.fillRect(x + 5, y + 5, 3, 3);
    p.fillRect(x + 11, y + 7, 3, 3);
}

// Collision detection
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Draw score
function drawScore() {
    p.fillStyle = "#253a61";
    p.fillRect(5, 5, 90, 16);

    p.fillStyle = "#ffffff";
    p.font = "bold 10px monospace";
    p.fillText("SCORE: " + score, 10, 16);
}

// Scale low-res game to visible canvas
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        pixelCanvas,
        0, 0,
        canvas.width,
        canvas.height
    );
}

// Restart game
function restartGame() {
    score = 0;
    frame = 0;
    obstacles = [];

    frog.y = groundY - frog.height;
    frog.velocityY = 0;
    frog.isJumping = false;

    isPlaying = true;
    update();
}

// Main loop
function update() {
    if (!isPlaying) return;

    frame++;

    drawBackground();

    // Frog physics
    frog.velocityY += gravity;
    frog.y += frog.velocityY;

    if (frog.y >= groundY - frog.height) {
        frog.y = groundY - frog.height;
        frog.velocityY = 0;
        frog.isJumping = false;
    }

    drawFrog();

    // Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];

        obs.x -= gameSpeed;
        drawMushroom(obs);

        if (checkCollision(frog, obs)) {
            isPlaying = false;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }

    drawScore();

    if (!isPlaying) {
        p.fillStyle = "rgba(0, 0, 0, 0.7)";
        p.fillRect(0, 0, 400, 125);

        p.fillStyle = "#ffdf40";
        p.font = "bold 22px monospace";
        p.textAlign = "center";
        p.fillText("GAME OVER", 200, 55);

        p.fillStyle = "#ffffff";
        p.font = "10px monospace";
        p.fillText("PRESS SPACE TO RESTART", 200, 75);
        p.textAlign = "left";

        render();
        return;
    }

    render();
    requestAnimationFrame(update);
}

update();
