const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const TILE = 16;
const BASE_COLS = 80;
const BASE_ROWS = 60;

let map = []; // será preenchido com window.gameMap
const player = { x: 0, y: 0, w: 16, h: 16, vx: 0, vy: 0, onGround: false };
const gravity = 0.45;
let estado = 'editor';
let keys = { l: false, r: false };
let joyX = 0;

const win = document.getElementById('overlayWin');
const lose = document.getElementById('overlayLose');
const joystick = document.getElementById('joystick');
const jumpBtn = document.getElementById('jumpBtn');

let cam = { x: 0, y: 0, zoom: 1 };

// ===== FUNÇÕES AUXILIARES =====
function achar(v){
  for(let y = 0; y < BASE_ROWS; y++)
    for(let x = 0; x < BASE_COLS; x++)
      if(map[y][x] === v) return { x, y };
}

function solid(x, y){ return map[y]?.[x] === 1; }

function colisao(nx, ny){
  const l = Math.floor(nx / TILE), r = Math.floor((nx + player.w - 1) / TILE),
        t = Math.floor(ny / TILE), b = Math.floor((ny + player.h - 1) / TILE);
  return solid(l, t) || solid(r, t) || solid(l, b) || solid(r, b);
}

// ===== UPDATE =====
function update(){
  if(estado !== 'jogo') return;

  // Gravidade
  player.vy += gravity;
  if(!colisao(player.x, player.y + player.vy)){
    player.y += player.vy;
    player.onGround = false;
  } else {
    player.vy = 0;
    player.onGround = true;
  }

  // Movimento horizontal
  player.vx = (keys.l ? -1 : 0) + (keys.r ? 1 : 0) + joyX;
  player.vx = Math.max(-1, Math.min(1, player.vx)) * 2.6;
  if(!colisao(player.x + player.vx, player.y)) player.x += player.vx;

  // Limite inferior
  if(player.y > canvas.height){
    estado = 'lose';
    lose.style.display = 'flex';
  }

  // Vitória
  const cx = Math.floor((player.x + player.w/2) / TILE);
  const cy = Math.floor((player.y + player.h/2) / TILE);
  if(map[cy]?.[cx] === 2){
    estado = 'win';
    win.style.display = 'flex';
  }

  // Atualiza câmera para centralizar no player
  cam.x = player.x + player.w/2 - canvas.width/2;
  cam.y = player.y + player.h/2 - canvas.height/2;
}

// ===== DRAW =====
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cam.x, -cam.y);

  for(let y = 0; y < BASE_ROWS; y++)
    for(let x = 0; x < BASE_COLS; x++){
      if(map[y][x] === 1){ ctx.fillStyle = '#4caf50'; ctx.fillRect(x*TILE, y*TILE, TILE, TILE); }
      if(map[y][x] === 2){ ctx.fillStyle = '#e53935'; ctx.fillRect(x*TILE, y*TILE, TILE, TILE); }
      if(map[y][x] === 3){ ctx.fillStyle = '#ffca28'; ctx.fillRect(x*TILE, y*TILE, TILE, TILE); }
    }

  // Player
  ctx.fillStyle = '#ff0';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.restore();
}

function loop(){ update(); draw(); requestAnimationFrame(loop); }

// ===== MOSTRAR JOGO =====
function mostrarJogo(){
  if(!window.gameMap) return alert('Mapa do editor não encontrado');
  map = window.gameMap.map(row => row.slice());

  const s = achar(3), g = achar(2);
  if(!s || !g) return alert('Spawn e Chegada obrigatórios');

  document.getElementById('editor').style.display = 'none';
  document.getElementById('jogo').style.display = 'flex';
  joystick.style.display = jumpBtn.style.display = 'block';
  win.style.display = lose.style.display = 'none';

  player.x = s.x * TILE;
  player.y = s.y * TILE - 1;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;

  estado = 'jogo';
  loop();
}

function mostrarEditor(){
  estado = 'editor';
  document.getElementById('jogo').style.display = 'none';
  document.getElementById('editor').style.display = 'flex';
  joystick.style.display = jumpBtn.style.display = 'none';
}

// ===== CONTROLES =====
onkeydown = e => {
  if(e.key === 'ArrowLeft') keys.l = true;
  if(e.key === 'ArrowRight') keys.r = true;
  if((e.key === 'ArrowUp' || e.key === ' ') && player.onGround) player.vy = -8;
};

onkeyup = e => {
  if(e.key === 'ArrowLeft') keys.l = false;
  if(e.key === 'ArrowRight') keys.r = false;
};

// Joystick
joystick.addEventListener('touchmove', e => {
  const r = joystick.getBoundingClientRect();
  joyX = Math.max(-1, Math.min(1, (e.touches[0].clientX - (r.left + 60)) / 40));
});
joystick.addEventListener('touchend', () => joyX = 0);

// Botão pular
jumpBtn.ontouchstart = () => { if(player.onGround) player.vy = -8; };
