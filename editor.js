const TILE=16;
const COLS=80, ROWS=60;

let map=Array.from({length:ROWS},()=>Array(COLS).fill(0));
let modo='plataforma', pintando=false;
const grid=document.getElementById('grid');

/* undo / redo */
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
  render();
}
function redo(){
  if(!redoStack.length) return;
  hist.push(JSON.stringify(map));
  map=JSON.parse(redoStack.pop());
  render();
}

function setModo(m){modo=m}

function limpar(v){
  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++)
      if(map[y][x]===v) map[y][x]=0;
}

function pintar(x,y){
  if(modo==='plataforma') map[y][x]=1;
  if(modo==='spawn'){limpar(3);map[y][x]=3}
  if(modo==='goal'){limpar(2);map[y][x]=2}
  if(modo==='delete') map[y][x]=0;
}

function render(){
  grid.style.gridTemplateColumns=`repeat(${COLS},${TILE}px)`;
  grid.innerHTML='';
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const d=document.createElement('div');
    d.className='tile';
    if(map[y][x]==1) d.classList.add('platform');
    if(map[y][x]==2) d.classList.add('goal');
    if(map[y][x]==3) d.classList.add('spawn');

    d.onmousedown=()=>{
      snapshot();
      pintando=true;
      pintar(x,y);
      render();
    };
    d.onmouseenter=()=>{
      if(pintando){
        pintar(x,y);
        render();
      }
    };
    grid.appendChild(d);
  }
}
render();

onmouseup=()=>pintando=false;

function testar(){
  localStorage.setItem('cattroll_map', JSON.stringify(map));
  location.href='game.html';
}
