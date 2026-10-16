const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game States & Configuration
let isPlaying = true;
let gravity = 0.6; // Pulls the dino down
let gameSpeed = 5; // Horizontal movement speed

// 1. Dinosaur Object
const dino = {
    x: 50,
    y: 200, // Ground level (canvas height 250 - dino height 50)
    width: 40,
    height: 50,
    velocityY: 0,
    isJumping: false,
    jumpStrength: -12 // Initial upward force
};

// 2. Obstacles Array (Cacti)
let obstacles = [];

function spawnObstacle() {
    // Basic block obstacle pushing from the right side of the screen
    obstacles.push({
        x: canvas.width,
        y: 210, // Resting on the ground line
        width: 20,
        height: 40
    });
}
// Automatically spawn an obstacle every 2 seconds
setInterval(spawnObstacle, 2000);

// 3. User Controls (Jump Input)
window.addEventListener("keydown", (e) => {
    if ((e.code === "Space" || e.code === "ArrowUp") && !dino.isJumping) {
        dino.velocityY = dino.jumpStrength;
        dino.isJumping = true;
    }
});

// 4. Collision Detection Function
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 5. Main Game Loop
function update() {
    if (!isPlaying) return;

    // Clear canvas frame before drawing next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Dinosaur Physics ---
    dino.velocityY += gravity; // Apply constant downward pull
    dino.y += dino.velocityY;

    // Ground restriction (Prevents falling through canvas floor)
    if (dino.y >= 200) {
        dino.y = 200;
        dino.velocityY = 0;
        dino.isJumping = false;
    }

    // Draw Dinosaur (Placeholder: Black Rectangle)
    ctx.fillStyle = "#535353";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // --- Obstacles Processing ---
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed; // Move left

        // Draw Obstacle (Placeholder: Red Rectangle)
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Check if Dino hit obstacle
        if (checkCollision(dino, obs)) {
            isPlaying = false;
            alert("Game Over!");
        }

        // Remove off-screen obstacles to optimize memory
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
        }
    }

    requestAnimationFrame(update);
}

// Start the loop
update();