const TILE=16;
const map=JSON.parse(localStorage.getItem('cattroll_map'));

const ROWS=map.length;
const COLS=map[0].length;

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');

const player={x:0,y:0,w:16,h:16,vx:0,vy:0,onGround:false};
const gravity=0.45;
let keys={l:false,r:false},joyX=0;
let cam={x:0,y:0};

const overlay=document.getElementById('overlay');
const msg=document.getElementById('msg');

function achar(v){
  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++)
      if(map[y][x]===v) return{x,y};
}

function solid(x,y){return map[y]?.[x]==1}

function colisao(nx,ny){
  const l=Math.floor(nx/TILE),r=Math.floor((nx+15)/TILE),
        t=Math.floor(ny/TILE),b=Math.floor((ny+15)/TILE);
  return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

const s=achar(3);
player.x=s.x*TILE;
player.y=s.y*TILE;

function update(){
  player.vy+=gravity;
  if(!colisao(player.x,player.y+player.vy)){
    player.y+=player.vy;
    player.onGround=false;
  }else{
    player.vy=0;
    player.onGround=true;
  }

  player.vx=(keys.l?-1:0)+(keys.r?1:0)+joyX;
  player.vx=Math.max(-1,Math.min(1,player.vx))*2.6;
  if(!colisao(player.x+player.vx,player.y)) player.x+=player.vx;

  cam.x=player.x-canvas.width/2+8;
  cam.y=player.y-canvas.height/2+8;

  const cx=Math.floor((player.x+8)/TILE),
        cy=Math.floor((player.y+8)/TILE);
  if(map[cy]?.[cx]==2){
    msg.textContent='🎉 Vitória!';
    overlay.style.display='flex';
  }
}

function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.translate(-cam.x,-cam.y);

  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++){
      if(map[y][x]==1){
        ctx.fillStyle='#4caf50';
        ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
      }
      if(map[y][x]==2){
        ctx.fillStyle='#e53935';
        ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
      }
    }

  ctx.fillStyle='#ff0';
  ctx.fillRect(player.x,player.y,player.w,player.h);
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

/* CONTROLES */
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

document.getElementById('jumpBtn').ontouchstart=()=>{
  if(player.onGround) player.vy=-8;
};

function voltar(){
  location.href='editor.html';
}
