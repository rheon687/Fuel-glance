import {parseCsv,selectStations,rankClass,formatAge} from './logic.js';
const DATA_URL='https://raw.githubusercontent.com/matthewgall/fuelfinder-archive/main/data.csv';
const stationsEl=document.querySelector('#stations'), statusEl=document.querySelector('#status'), pullEl=document.querySelector('#pull');
let startY=null, armed=false;
function render(items){
  const available=items.filter(x=>!x.unavailable).sort((a,b)=>a.price-b.price);
  const unavailable=items.filter(x=>x.unavailable);
  const prices=available.map(x=>x.price), times=available.map(x=>x.updated.getTime());
  stationsEl.innerHTML=[...available,...unavailable].map(x=>x.unavailable?`<section class="station"><div><div class="name">${x.displayName}</div><div class="updated red">Price unavailable</div></div><div class="price red">—</div></section>`:`<section class="station" aria-label="${x.displayName}, ${x.price.toFixed(1)}, ${formatAge(x.updated)}"><div><div class="name">${x.displayName}</div><div class="updated ${rankClass(x.updated.getTime(),times,false)}">${formatAge(x.updated)}<small>${x.updated.toLocaleString('en-GB',{weekday:'short',hour:'2-digit',minute:'2-digit'})}</small></div></div><div class="price ${rankClass(x.price,prices,true)}">${x.price.toFixed(1)}</div></section>`).join('');
}
async function refresh(){
  statusEl.className=''; statusEl.textContent='Checking prices…';
  try{const response=await fetch(DATA_URL,{cache:'no-store'}); if(!response.ok)throw new Error(`Data request failed (${response.status})`);
    const rows=parseCsv(await response.text()); const items=selectStations(rows); render(items);
    if(items.every(x=>x.unavailable)) throw new Error('The three stations were not found in the latest data');
    localStorage.setItem('fuel-glance-cache',JSON.stringify(items));
    statusEl.textContent=`Checked ${new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`;
  }catch(error){const cached=localStorage.getItem('fuel-glance-cache'); if(cached){const items=JSON.parse(cached).map(x=>({...x,updated:new Date(x.updated)}));render(items);statusEl.textContent='Showing saved prices — refresh unavailable';statusEl.className='error';}else{statusEl.textContent=error.message;statusEl.className='error';}}
  pullEl.classList.remove('ready'); armed=false;
}
document.addEventListener('touchstart',e=>{if(scrollY===0)startY=e.touches[0].clientY},{passive:true});
document.addEventListener('touchmove',e=>{if(startY!==null&&e.touches[0].clientY-startY>55){armed=true;pullEl.classList.add('ready');statusEl.textContent='Release to refresh';}},{passive:true});
document.addEventListener('touchend',()=>{if(armed)refresh();startY=null});
window.addEventListener('keydown',e=>{if(e.key==='r'||e.key==='R')refresh()});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');
refresh();
