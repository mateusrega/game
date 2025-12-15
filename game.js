const TILE=16;
const BASE_COLS=80, BASE_ROWS=60;
let map=Array.from({length:BASE_ROWS},()=>Array(BASE_COLS).fill(0));

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const player={x:0,y:0,w:16,h:16,vx:0,vy:0,onGround:false};
const gravity=0.45;
let estado='jogo', keys={l:false,r:false}, joyX=0;
const win=document.getElementById('overlayWin');
const lose=document.getElementById('overlayLose');

/* ===== FUNCÕES AUX ===== */
function achar(v){
  for(let y=0;y<BASE_ROWS;y++)
    for(let x=0;x<BASE_COLS;x++)
      if(map[y][x]===v) return{x,y};
}
function solid(x,y){return map[y]?.[x]==1}
function colisao(nx,ny){
  const l=Math.floor(nx/TILE),r=Math.floor((nx+15)/TILE),
        t=Math.floor(ny/TILE),b=Math.floor((ny+15)/TILE);
  return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

/* ===== UPDATE ===== */
function update(){
  if(estado!=='jogo') return;
  player.vy+=gravity;
  if(!colisao(player.x,player.y+player.vy)){
    player.y+=player.vy; player.onGround=false;
  }else{
    player.vy=0; player.onGround=true;
  }
  player.vx=(keys.l?-1:0)+(keys.r?1:0)+joyX;
  player.vx=Math.max(-1,Math.min(1,player.vx))*2.6;
  if(!colisao(player.x+player.vx,player.y)) player.x+=player.vx;
  if(player.y>canvas.height){estado='lose';lose.style.display='flex'}
  const cx=Math.floor((player.x+8)/TILE),
        cy=Math.floor((player.y+8)/TILE);
  if(map[cy]?.[cx]==2){estado='win';win.style.display='flex'}
}

/* ===== DRAW ===== */
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<BASE_ROWS;y++)for(let x=0;x<BASE_COLS;x++){
    if(map[y][x]==1){ctx.fillStyle='#4caf50';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
    if(map[y][x]==2){ctx.fillStyle='#e53935';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
  }
  ctx.fillStyle='#ff0';
  ctx.fillRect(player.x,player.y,player.w,player.h);
}

function loop(){update();draw();requestAnimationFrame(loop)}

/* ===== INTERAÇÕES ===== */
function mostrarJogo(){
  estado='jogo';
  loop();
}
function mostrarEditor(){
  window.location.href='editor.html';
}

onkeydown=e=>{
  if(e.key==='ArrowLeft') keys.l=true;
  if(e.key==='ArrowRight') keys.r=true;
  if((e.key==='ArrowUp'||e.key===' ')&&player.onGround) player.vy=-8;
};
onkeyup=e=>{
  if(e.key==='ArrowLeft') keys.l=false;
  if(e.key==='ArrowRight') keys.r=false;
};

const joystick=document.getElementById('joystick');
joystick.addEventListener('touchmove',e=>{
  const r=joystick.getBoundingClientRect();
  joyX=Math.max(-1,Math.min(1,(e.touches[0].clientX-(r.left+60))/40));
});
joystick.addEventListener('touchend',()=>joyX=0);

const jumpBtn=document.getElementById('jumpBtn');
jumpBtn.ontouchstart=()=>{if(player.onGround)player.vy=-8};
