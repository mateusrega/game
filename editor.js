const TILE=16, COLS=80, ROWS=60;
let map=Array.from({length:ROWS},()=>Array(COLS).fill(0));
let modo=1, pintando=false;

const grid=document.getElementById('grid');
grid.style.gridTemplateColumns=`repeat(${COLS},${TILE}px)`;

function render(){
  grid.innerHTML='';
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const d=document.createElement('div');
    d.className='tile';
    if(map[y][x]==1)d.classList.add('p');
    if(map[y][x]==2)d.classList.add('g');
    if(map[y][x]==3)d.classList.add('s');

    d.onmousedown=()=>{pintando=true;pintar(x,y)};
    d.onmouseenter=()=>{if(pintando)pintar(x,y)};

    grid.appendChild(d);
  }
}
document.onmouseup=()=>pintando=false;

function pintar(x,y){
  if(modo==3) limpar(3);
  if(modo==2) limpar(2);
  map[y][x]=modo;
  render();
}

function limpar(v){
  for(let y=0;y<ROWS;y++)
    for(let x=0;x<COLS;x++)
      if(map[y][x]==v) map[y][x]=0;
}

document.querySelectorAll('[data-m]').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('[data-m]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    modo=+b.dataset.m;
  };
});

document.getElementById('testar').onclick=()=>{
  localStorage.setItem('cattroll_map',JSON.stringify(map));
  location.href='game.html';
};

render();
