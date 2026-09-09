import { LEVELS } from './levels.js';
import { Player } from './player.js';
import { rectCollision, getSpikeRects } from './collision.js';
import { AudioManager } from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const levelName = document.getElementById('level-name');
const progressBar = document.getElementById('progress-bar');
const attemptLabel = document.getElementById('attempt-label');
const startScreen = document.getElementById('start-screen');
const deathScreen = document.getElementById('death-screen');
const completeScreen = document.getElementById('complete-screen');
const deathMessage = document.getElementById('death-message');
const completeTitle = document.getElementById('complete-title');
const completeMessage = document.getElementById('complete-message');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const nextButton = document.getElementById('next-button');

const GROUND_Y = 510;
const PLAYER_START_X = 180;
const AUDIO = new AudioManager();

let currentLevel = 0;
let cameraX = 0;
let levelProgress = 0;
let attempt = 1;
let state = 'menu';

const player = new Player(GROUND_Y);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function hideScreens() {
  startScreen.classList.add('hidden');
  deathScreen.classList.add('hidden');
  completeScreen.classList.add('hidden');
}

function startLevel() {
  hideScreens();
  state = 'playing';
  AUDIO.ensureAudio();

  cameraX = 0;
  levelProgress = 0;
  player.reset();

  attemptLabel.textContent = `ATTEMPT ${attempt}`;

  const level = LEVELS[currentLevel];
  levelName.textContent = `LEVEL ${currentLevel + 1} · ${level.name}`;
  progressBar.style.width = '0%';
}

function die() {
  if (state !== 'playing') return;

  state = 'dead';
  AUDIO.playCrash();
  attempt += 1;
  deathMessage.textContent = `You reached ${Math.floor(levelProgress * 100)}%.`;
  deathScreen.classList.remove('hidden');
}

function completeLevel() {
  state = 'complete';

  const level = LEVELS[currentLevel];
  completeMessage.textContent = `${level.name} cleared at 100%.`;

  if (currentLevel === LEVELS.length - 1) {
    completeTitle.textContent = 'GAME COMPLETE!';
    nextButton.textContent = 'PLAY AGAIN';
  } else {
    completeTitle.textContent = 'LEVEL COMPLETE!';
    nextButton.textContent = 'NEXT LEVEL';
  }

  completeScreen.classList.remove('hidden');
}

function nextLevel() {
  if (currentLevel >= LEVELS.length - 1) {
    currentLevel = 0;
    attempt = 1;
  } else {
    currentLevel += 1;
  }

  startLevel();
}

function jump() {
  if (state === 'menu') {
    startLevel();
    return;
  }

  if (state === 'dead') {
    startLevel();
    return;
  }

  if (state === 'complete') {
    nextLevel();
    return;
  }

  if (state === 'playing') {
    player.jump();
    AUDIO.playJump();
  }
}

function update() {
  if (state !== 'playing') return;

  const level = LEVELS[currentLevel];

  player.x += level.speed;
  player.update();

  cameraX = Math.max(0, player.x - canvas.clientWidth * 0.25);

  levelProgress = Math.min(1, (player.x - PLAYER_START_X) / (level.length - PLAYER_START_X));
  progressBar.style.width = `${levelProgress * 100}%`;

  const playerRect = {
    x: player.x + 6,
    y: player.y + 6,
    width: player.size - 12,
    height: player.size - 10,
  };

  for (const spike of getSpikeRects(level, GROUND_Y)) {
    if (rectCollision(playerRect, spike)) {
      die();
      return;
    }
  }

  if (player.x >= level.length) {
    completeLevel();
  }
}

function drawWorldBranding() {
  const t = performance.now() * 0.001;
  const offset = (cameraX * 0.35 + t * 28) % (canvas.width + 400);

  ctx.save();
  ctx.font = '900 56px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';

  for (let i = -1; i < 6; i += 1) {
    const x = i * 260 - offset;
    const y = 110 + Math.sin((t * 1.7) + i) * 14;

    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillText("DRENI'S WORLD", x, y);

    ctx.fillStyle = 'rgba(58, 214, 255, 0.18)';
    ctx.fillText("DRENI'S WORLD", x + 3, y + 3);
  }

  ctx.restore();

  ctx.save();
  const crestX = canvas.width - 180 - (cameraX * 0.12);
  const crestY = 110;

  ctx.translate(crestX, crestY);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 214, 80, 0.9)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 54, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f9c74f';
  ctx.beginPath();
  ctx.moveTo(-34, -12);
  ctx.lineTo(-18, -32);
  ctx.lineTo(-4, -18);
  ctx.lineTo(10, -32);
  ctx.lineTo(28, -12);
  ctx.lineTo(40, 18);
  ctx.lineTo(-40, 18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#173a72';
  ctx.fillRect(-26, 6, 52, 32);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 30px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RM', 0, 30);

  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = '800 18px "Segoe UI", sans-serif';
  ctx.fillText('REAL MADRID', 0, 82);

  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  ctx.font = '900 20px "Segoe UI", sans-serif';
  ctx.fillText('RONALDO 7', 0, 110);
  ctx.restore();
}

function drawBackground() {
  const level = LEVELS[currentLevel];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0d1730');
  gradient.addColorStop(1, '#050912');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWorldBranding();

  ctx.save();
  ctx.translate(-(cameraX % 50), 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width + 100; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width + 100, y);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  const offset = -(cameraX * 0.15) % 160;
  for (let x = offset - 160; x < canvas.width + 160; x += 160) {
    const height = 80 + ((x * 7) % 100);
    ctx.fillStyle = 'rgba(95, 118, 216, 0.12)';
    ctx.fillRect(x, GROUND_Y - height, 110, height);
  }
  ctx.restore();

  ctx.fillStyle = '#10182a';
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  ctx.fillStyle = level.color;
  ctx.fillRect(0, GROUND_Y, canvas.width, 3);
}

function drawSpikes() {
  const level = LEVELS[currentLevel];
  ctx.save();
  ctx.translate(-cameraX, 0);

  for (const spike of getSpikeRects(level, GROUND_Y)) {
    if (spike.x < cameraX - 100 || spike.x > cameraX + canvas.width + 100) {
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(spike.x, GROUND_Y);
    ctx.lineTo(spike.x + spike.width / 2, GROUND_Y - spike.height);
    ctx.lineTo(spike.x + spike.width, GROUND_Y);
    ctx.closePath();

    ctx.fillStyle = level.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

function drawFinish() {
  const level = LEVELS[currentLevel];
  const x = level.length - cameraX;

  if (x < -100 || x > canvas.width + 100) return;

  ctx.save();
  ctx.strokeStyle = level.color;
  ctx.lineWidth = 4;
  ctx.shadowBlur = 18;
  ctx.shadowColor = level.color;

  ctx.beginPath();
  ctx.moveTo(x, 150);
  ctx.lineTo(x, GROUND_Y);
  ctx.stroke();

  ctx.fillStyle = level.color;
  ctx.beginPath();
  ctx.moveTo(x, 150);
  ctx.lineTo(x + 100, 180);
  ctx.lineTo(x, 215);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  const level = LEVELS[currentLevel];
  const screenX = player.x - cameraX;
  const screenY = player.y;

  ctx.save();
  ctx.translate(screenX + player.size / 2, screenY + player.size / 2);
  ctx.rotate(player.rotation);
  ctx.shadowBlur = 20;
  ctx.shadowColor = level.color;

  ctx.fillStyle = '#f6f8ff';
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);

  ctx.fillStyle = level.color;
  ctx.fillRect(-13, -13, 26, 26);

  ctx.fillStyle = '#0b1020';
  ctx.fillRect(-8, -7, 5, 7);
  ctx.fillRect(3, -7, 5, 7);
  ctx.restore();
}

function draw() {
  drawBackground();
  drawFinish();
  drawSpikes();

  if (state !== 'menu') {
    drawPlayer();
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
    event.preventDefault();
    jump();
  }
});

canvas.addEventListener('pointerdown', jump);
startButton.addEventListener('click', startLevel);
retryButton.addEventListener('click', startLevel);
nextButton.addEventListener('click', nextLevel);

resizeCanvas();
startScreen.classList.remove('hidden');

let lastTime = performance.now();
function loop(time) {
  const delta = Math.min(32, time - lastTime);
  lastTime = time;

  const factor = delta / 16.67;
  if (state === 'playing') {
    player.x += 0;
    update();
  }

  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
