const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let shipX = canvas.width / 2 - 25;
const shipWidth = 50;
const shipHeight = 50;
let shipSpeed = 5;

let bullets = [];
const bulletWidth = 5;
const bulletHeight = 15;
const bulletSpeed = 7;

let invaders = [];
const invaderWidth = 50;
const invaderHeight = 50;
const invaderSpeed = 2;
const invaderRows = 3;
const invaderCols = 10;

let score = 0;
let gameOver = false;

let invaderBullets = [];
const invaderBulletWidth = 5;
const invaderBulletHeight = 15;
const invaderBulletSpeed = 5;

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key == ' ' && bullets.length < 5) {
        bullets.push({
            x: shipX + shipWidth / 2 - bulletWidth / 2,
            y: canvas.height - shipHeight,
            width: bulletWidth,
            height: bulletHeight
        });
    }
}

function drawInvaderBullets() {
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < invaderBullets.length; i++) {
        const bullet = invaderBullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y += invaderBulletSpeed;
        if (bullet.y > canvas.height) {
            invaderBullets.splice(i, 1);
            i--;
        }
    }
}

function invaderShoot() {
    if (Math.random() < 0.01 && invaders.length > 0) {
        const randomInvader = invaders[Math.floor(Math.random() * invaders.length)];
        invaderBullets.push({
            x: randomInvader.x + invaderWidth / 2 - invaderBulletWidth / 2,
            y: randomInvader.y + invaderHeight,
            width: invaderBulletWidth,
            height: invaderBulletHeight
        });
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function createInvaders() {
    for (let c = 0; c < invaderCols; c++) {
        for (let r = 0; r < invaderRows; r++) {
            invaders.push({
                x: c * (invaderWidth + 10) + 30,
                y: r * (invaderHeight + 10) + 30,
                width: invaderWidth,
                height: invaderHeight,
                direction: 1
            });
        }
    }
}

function drawShip() {
    ctx.fillStyle = 'green';
    ctx.fillRect(shipX, canvas.height - shipHeight, shipWidth, shipHeight);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function drawInvaders() {
    ctx.fillStyle = 'purple';
    let edgeReached = false;
    for (let i = 0; i < invaders.length; i++) {
        const invader = invaders[i];
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        invader.x += invaderSpeed * invader.direction;
        if (invader.x + invader.width > canvas.width || invader.x < 0) {
            edgeReached = true;
        }
    }

    if (edgeReached) {
        for (let i = 0; i < invaders.length; i++) {
            invaders[i].direction *= -1;
            invaders[i].y += invaderHeight;
        }
    }
}

function collisionDetection() {
    // Bullet and invader collision
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = invaders.length - 1; j >= 0; j--) {
            const bullet = bullets[i];
            const invader = invaders[j];
            if (
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y
            ) {
                bullets.splice(i, 1);
                invaders.splice(j, 1);
                score += 10;
                break; // Exit the inner loop since the bullet is gone
            }
        }
    }

    // Invader and ship collision
    for (let i = 0; i < invaders.length; i++) {
        const invader = invaders[i];
        if (
            shipX < invader.x + invader.width &&
            shipX + shipWidth > invader.x &&
            canvas.height - shipHeight < invader.y + invader.height &&
            canvas.height - shipHeight + shipHeight > invader.y
        ) {
            gameOver = true;
        }
    }

    // Invader bullet and ship collision
    for (let i = 0; i < invaderBullets.length; i++) {
        const bullet = invaderBullets[i];
        if (
            shipX < bullet.x + bullet.width &&
            shipX + shipWidth > bullet.x &&
            canvas.height - shipHeight < bullet.y + bullet.height &&
            canvas.height - shipHeight + shipHeight > bullet.y
        ) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function draw() {
    if (invaders.length === 0) {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('YOU WIN!', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    if (gameOver) {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawBullets();
    drawInvaderBullets();
    invaderShoot();
    drawInvaders();
    drawScore();
    collisionDetection();

    if (rightPressed && shipX < canvas.width - shipWidth) {
        shipX += shipSpeed;
    } else if (leftPressed && shipX > 0) {
        shipX -= shipSpeed;
    }

    requestAnimationFrame(draw);
}

createInvaders();
draw();
