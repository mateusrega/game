const TILE=16;
const map=JSON.parse(localStorage.getItem('cattroll_map'));
if(!map){location.href='editor.html'}

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');

const ROWS=map.length, COLS=map[0].length;

const player={x:0,y:0,w:16,h:16,vx:0,vy:0,onGround:false};
const gravity=0.45;
let keys={l:false,r:false};

function achar(v){
  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++)
      if(map[y][x]==v) return{x,y};
}

const spawn=achar(3), goal=achar(2);
player.x=spawn.x*TILE;
player.y=spawn.y*TILE-1;

function solid(x,y){return map[y]?.[x]==1}
function col(nx,ny){
  const l=Math.floor(nx/TILE),r=Math.floor((nx+15)/TILE),
        t=Math.floor(ny/TILE),b=Math.floor((ny+15)/TILE);
  return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

function update(){
  player.vy+=gravity;
  if(!col(player.x,player.y+player.vy)){
    player.y+=player.vy;player.onGround=false;
  }else{player.vy=0;player.onGround=true}

  player.vx=(keys.l?-1:0)+(keys.r?1:0);
  if(!col(player.x+player.vx*2.5,player.y))
    player.x+=player.vx*2.5;

  const cx=Math.floor((player.x+8)/TILE),
        cy=Math.floor((player.y+8)/TILE);
  if(map[cy]?.[cx]==2) win();
  if(player.y>canvas.height) lose();
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(map[y][x]==1){ctx.fillStyle='#4caf50';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
    if(map[y][x]==2){ctx.fillStyle='#e53935';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
  }
  ctx.fillStyle='#ff0';
  ctx.fillRect(player.x,player.y,player.w,player.h);
}

function loop(){update();draw();requestAnimationFrame(loop)}
loop();

onkeydown=e=>{
  if(e.key==='ArrowLeft') keys.l=true;
  if(e.key==='ArrowRight') keys.r=true;
  if((e.key==='ArrowUp'||e.key===' ')&&player.onGround) player.vy=-8;
};
onkeyup=e=>{
  if(e.key==='ArrowLeft') keys.l=false;
  if(e.key==='ArrowRight') keys.r=false;
};

function win(){document.getElementById('win').style.display='flex'}
function lose(){document.getElementById('lose').style.display='flex'}
function restart(){location.reload()}
function voltar(){location.href='editor.html'}
