const TILE=16;
const map=JSON.parse(localStorage.getItem('cattroll_map'));
if(!map){location.href='editor.html'}

const c=document.getElementById('c');
const ctx=c.getContext('2d');

let p={x:0,y:0,vx:0,vy:0,on:false};

function find(v){
  for(let y=0;y<map.length;y++)
    for(let x=0;x<map[0].length;x++)
      if(map[y][x]==v) return{x,y};
}

const s=find(3);
p.x=s.x*TILE;
p.y=s.y*TILE;

function solid(x,y){return map[y]?.[x]==1}
function col(nx,ny){
  const l=nx>>4,r=(nx+15)>>4,t=ny>>4,b=(ny+15)>>4;
  return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

let k={l:0,r:0};

onkeydown=e=>{
  if(e.key=='ArrowLeft')k.l=1;
  if(e.key=='ArrowRight')k.r=1;
  if(e.key=='ArrowUp'&&p.on)p.vy=-8;
};
onkeyup=e=>{
  if(e.key=='ArrowLeft')k.l=0;
  if(e.key=='ArrowRight')k.r=0;
};

function loop(){
  p.vy+=0.45;
  if(!col(p.x,p.y+p.vy)){p.y+=p.vy;p.on=false}else{p.vy=0;p.on=true}
  p.vx=(k.r-k.l)*2.5;
  if(!col(p.x+p.vx,p.y))p.x+=p.vx;
  draw();
  requestAnimationFrame(loop);
}

function draw(){
  ctx.clearRect(0,0,c.width,c.height);
  ctx.save();
  ctx.translate(c.width/2-p.x,c.height/2-p.y);

  for(let y=0;y<map.length;y++)
    for(let x=0;x<map[0].length;x++){
      if(map[y][x]==1){ctx.fillStyle='#4caf50';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
      if(map[y][x]==2){ctx.fillStyle='#e53935';ctx.fillRect(x*TILE,y*TILE,TILE,TILE)}
    }

  ctx.fillStyle='#ff0';
  ctx.fillRect(p.x,p.y,16,16);
  ctx.restore();
}

loop();
