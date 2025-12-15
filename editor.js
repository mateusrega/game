const TILE=16;
const BASE_COLS=80, BASE_ROWS=60;
let map=Array.from({length:BASE_ROWS},()=>Array(BASE_COLS).fill(0));
let modo='plataforma', pintando=false;
let cam={x:0,y:0,zoom:1};
const grid=document.getElementById('grid');
const wrap=document.getElementById('gridWrap');

/* ===== RENDER CONTROL ===== */
let needsRender=false;
function requestRender(){
  if(needsRender) return;
  needsRender=true;
  requestAnimationFrame(()=>{
    render();
    needsRender=false;
  });
}

/* ===== UNDO / REDO ===== */
let hist=[], redoStack=[];
function snapshot(){
  hist.push(JSON.stringify(map));
  if(hist.length>50) hist.shift();
  redoStack=[];
}
function undo(){
  if(!hist.length) return;
  redoStack.push(JSON.stringify(map));
  map=JSON.parse(hist.pop());
  requestRender();
}
function redo(){
  if(!redoStack.length) return;
  hist.push(JSON.stringify(map));
  map=JSON.parse(redoStack.pop());
  requestRender();
}

function setModo(m){modo=m}

function limpar(v){
  for(let y=0;y<BASE_ROWS;y++)
    for(let x=0;x<BASE_COLS;x++)
      if(map[y][x]===v) map[y][x]=0;
}

function pintar(x,y){
  if(modo==='plataforma') map[y][x]=1;
  if(modo==='spawn'){ limpar(3); map[y][x]=3; }
  if(modo==='goal'){ limpar(2); map[y][x]=2; }
  if(modo==='delete') map[y][x]=0;
}

function render(){
  grid.style.transform=`translate(${-cam.x}px,${-cam.y}px) scale(${cam.zoom})`;
  grid.style.gridTemplateColumns=`repeat(${BASE_COLS},${TILE}px)`;
  grid.innerHTML='';
  for(let y=0;y<BASE_ROWS;y++)for(let x=0;x<BASE_COLS;x++){
    const d=document.createElement('div');
    d.className='tile';
    if(map[y][x]==1) d.classList.add('platform');
    if(map[y][x]==2) d.classList.add('goal');
    if(map[y][x]==3) d.classList.add('spawn');

    d.onmousedown=()=>{
      snapshot();
      pintando=true;
      pintar(x,y);
      requestRender();
    };
    d.onmouseenter=()=>{
      if(pintando){
        pintar(x,y);
        requestRender();
      }
    };
    grid.appendChild(d);
  }
}
render();

onmouseup=()=>pintando=false;

/* ===== PAN + ZOOM ===== */
let dragging=false, lx=0, ly=0;
wrap.onmousedown=e=>{dragging=true;lx=e.clientX;ly=e.clientY};
onmouseup=()=>dragging=false;
onmousemove=e=>{
  if(dragging){
    cam.x-=e.clientX-lx;
    cam.y-=e.clientY-ly;
    lx=e.clientX; ly=e.clientY;
    requestRender();
  }
};
wrap.onwheel=e=>{
  cam.zoom=Math.max(0.5,Math.min(2,cam.zoom+(e.deltaY*-0.001)));
  requestRender();
};

/* ===== TESTAR JOGO ===== */
function mostrarJogo(){
  window.location.href='game.html';
}
