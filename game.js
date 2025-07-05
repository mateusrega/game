const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const player = {
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  vx: 0,
  vy: 0,
  grounded: false,
  color: 'white',
};

const gravity = 0.5;
const jumpForce = -10;
const speed = 3;
const keys = {};

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobile()) {
  criarBotoesTouch();
} else {
  ativarTeclado();
}

function ativarTeclado() {
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
}

function criarBotoesTouch() {
  const controles = document.createElement('div');
  controles.id = 'touch-controls';
  controles.innerHTML = `
    <button id="btn-esquerda">◀</button>
    <button id="btn-direita">▶</button>
    <button id="btn-pulo">⬆</button>
  `;
  document.body.appendChild(controles);

  document.getElementById('btn-esquerda').ontouchstart = () => keys['esquerda'] = true;
  document.getElementById('btn-esquerda').ontouchend = () => keys['esquerda'] = false;

  document.getElementById('btn-direita').ontouchstart = () => keys['direita'] = true;
  document.getElementById('btn-direita').ontouchend = () => keys['direita'] = false;

  document.getElementById('btn-pulo').ontouchstart = () => keys['pulo'] = true;
  document.getElementById('btn-pulo').ontouchend = () => keys['pulo'] = false;
}

const ground = {
  x: 0,
  y: canvas.height - 60,
  width: 2000,
  height: 60,
  color: 'green',
};

function update() {
  if (keys['ArrowLeft'] || keys['a'] || keys['esquerda']) player.vx = -speed;
  else if (keys['ArrowRight'] || keys['d'] || keys['direita']) player.vx = speed;
  else player.vx = 0;

  if ((keys['ArrowUp'] || keys['w'] || keys[' '] || keys['pulo']) && player.grounded) {
    player.vy = jumpForce;
    player.grounded = false;
  }

  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  // Colisão com chão
  if (
    player.y + player.height >= ground.y &&
    player.x + player.width > ground.x &&
    player.x < ground.x + ground.width
  ) {
    player.y = ground.y - player.height;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  // Troll: se passar por uma área, cai do nada
  if (player.x > 400 && player.x < 440 && player.grounded) {
    ground.y = canvas.height; // chão "some"
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const camX = player.x - canvas.width / 2 + player.width / 2;
  ctx.save();
  ctx.translate(-camX, 0);

  ctx.fillStyle = ground.color;
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
