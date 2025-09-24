const TILE_SIZE = 16;
let COLS = Math.floor((window.innerWidth * 0.9) / TILE_SIZE);
let ROWS = Math.floor((window.innerHeight * 0.9) / TILE_SIZE);

let map = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let modo = 'plataforma';
let pintando = false;

const grid = document.getElementById('grid');

function criarGrid() {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${COLS}, ${TILE_SIZE}px)`;
  grid.style.gridTemplateRows = `repeat(${ROWS}, ${TILE_SIZE}px)`;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const div = document.createElement('div');
      div.classList.add('tile');
      if (map[y][x] === 1) div.classList.add('platform');
      if (map[y][x] === 2) div.classList.add('goal');
      div.dataset.x = x;
      div.dataset.y = y;

      div.addEventListener('mousedown', () => {
        pintar(x, y);
        pintando = true;
      });

      div.addEventListener('mouseover', () => {
        if (pintando) pintar(x, y);
      });

      grid.appendChild(div);
    }
  }
}

function pintar(x, y) {
  if (modo === 'plataforma') {
    map[y][x] = 1;
  } else if (modo === 'goal') {
    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLS; j++)
        if (map[i][j] === 2) map[i][j] = 0;
    map[y][x] = 2;
  }
  criarGrid();
}

window.addEventListener('mouseup', () => pintando = false);

window.addEventListener('resize', () => location.reload());

criarGrid();

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let playing = false;

const player = {
  x: 50,
  y: 0,
  width: 14,
  height: 14,
  vy: 0,
  speed: 1.5,
  jumpPower: 5,
  onGround: false
};

const gravity = 0.25;
const keys = { left: false, right: false };

function checarColisao(nx, ny) {
  const left = Math.floor(nx / TILE_SIZE);
  const right = Math.floor((nx + player.width) / TILE_SIZE);
  const top = Math.floor(ny / TILE_SIZE);
  const bottom = Math.floor((ny + player.height) / TILE_SIZE);
  return (
    map[top]?.[left] === 1 ||
    map[top]?.[right] === 1 ||
    map[bottom]?.[left] === 1 ||
    map[bottom]?.[right] === 1
  );
}

function verificarObjetivo() {
  const cx = Math.floor((player.x + player.width / 2) / TILE_SIZE);
  const cy = Math.floor((player.y + player.height / 2) / TILE_SIZE);
  if (map[cy]?.[cx] === 2) {
    alert('🎉 Você venceu!');
    playing = false;
    mostrarEditor();
  }
}

function atualizar() {
  player.vy += gravity;
  let ny = player.y + player.vy;

  if (checarColisao(player.x, ny)) {
    player.vy = 0;
    player.onGround = true;
    player.y = Math.floor((ny + player.height) / TILE_SIZE) * TILE_SIZE - player.height;
  } else {
    player.y = ny;
    player.onGround = false;
  }

  if (keys.left) {
    let nx = player.x - player.speed;
    if (!checarColisao(nx, player.y)) player.x = nx;
  }
  if (keys.right) {
    let nx = player.x + player.speed;
    if (!checarColisao(nx, player.y)) player.x = nx;
  }

  verificarObjetivo();

  if (
    player.x < -player.width ||
    player.x > canvas.width ||
    player.y > canvas.height ||
    player.y < -player.height
  ) {
    alert('💀 Você caiu!');
    playing = false;
    mostrarEditor();
  }
}

function desenharMapa() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = '#6a3';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (map[y][x] === 2) {
        ctx.fillStyle = '#f55';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharMapa();
  ctx.fillStyle = '#ff0';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  atualizar();
  desenhar();
  if (playing) requestAnimationFrame(gameLoop);
}

function mostrarJogo() {
  document.getElementById('editor-tela').style.display = 'none';
  document.getElementById('jogo-tela').style.display = 'flex';
  playing = true;
  player.x = 50;
  player.y = 0;
  player.vy = 0;
  gameLoop();
}

function mostrarEditor() {
  playing = false;
  document.getElementById('jogo-tela').style.display = 'none';
  document.getElementById('editor-tela').style.display = 'flex';
}

window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'ArrowUp' && player.onGround) {
    player.vy = -player.jumpPower;
    player.onGround = false;
  }
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
});
