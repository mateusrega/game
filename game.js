const TILE = 16;
const COLS = 80;
const ROWS = 60;

/* ===== CARREGA MAPA DO EDITOR ===== */
const saved = localStorage.getItem('cattroll_map');
if(!saved){
  alert('Mapa não encontrado');
}
const map = JSON.parse(saved);

/* ===== CANVAS ===== */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* ===== PLAYER ===== */
const player = {
  x:0, y:0, w:16, h:16,
  vx:0, vy:0, onGround:false
};

const gravity = 0.45;
const keys = { l:false, r:false };

/* ===== UTIL ===== */
function achar(v){
  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++)
      if(map[y][x]===v) return {x,y};
}

function solid(x,y){
  return map[y]?.[x] === 1;
}

function colisao(nx,ny){
  const l=Math.floor(nx/TILE);
  const r=Math.floor((nx+15)/TILE);
  const t=Math.floor(ny/TILE);
  const b=Math.floor((ny+15)/TILE);
  return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

/* ===== SPAWN ===== */
const spawn = achar(3);
player.x = spawn.x * TILE;
player.y = spawn.y * TILE;

/* ===== UPDATE ===== */
function update(){
  player.vy += gravity;

  if(!colisao(player.x, player.y + player.vy)){
    player.y += player.vy;
    player.onGround = false;
  }else{
    player.vy = 0;
    player.onGround = true;
  }

  player.vx = (keys.l?-1:0) + (keys.r?1:0);
  player.vx *= 2.5;

  if(!colisao(player.x + player.vx, player.y)){
    player.x += player.vx;
  }
}

/* ===== DRAW COM CÂMERA CENTRALIZADA ===== */
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const camX = player.x - canvas.width/2 + 8;
  const camY = player.y - canvas.height/2 + 8;

  ctx.save();
  ctx.translate(-camX, -camY);

  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(map[y][x] === 1){
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
    }
    if(map[y][x] === 2){
      ctx.fillStyle = '#e53935';
      ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
    }
  }

  ctx.fillStyle = '#ff0';
  ctx.fillRect(player.x,player.y,player.w,player.h);

  ctx.restore();
}

/* ===== LOOP ===== */
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

/* ===== INPUT ===== */
onkeydown = e=>{
  if(e.key==='ArrowLeft') keys.l=true;
  if(e.key==='ArrowRight') keys.r=true;
  if((e.key==='ArrowUp'||e.key===' ') && player.onGround){
    player.vy = -8;
  }
};
onkeyup = e=>{
  if(e.key==='ArrowLeft') keys.l=false;
  if(e.key==='ArrowRight') keys.r=false;
};
