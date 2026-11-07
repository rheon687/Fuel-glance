export const DEFAULT_STATIONS = [
  { id: 'postcode:SK82AJ', displayName: 'Esso', postcode: 'SK8 2AJ' },
  { id: 'postcode:SK30RL', displayName: 'Morrisons', postcode: 'SK3 0RL' },
  { id: 'postcode:SK12BT', displayName: 'Tesco', postcode: 'SK1 2BT' },
  { id: 'postcode:OL70NS', displayName: 'Work', postcode: 'OL7 0NS' }
];
export const MAX_STATIONS = 6;
export function normalizePostcode(value=''){ return value.toUpperCase().replace(/\s+/g,'').trim(); }
export function formatPostcode(value=''){
  const clean=normalizePostcode(value); if(clean.length<5)return value.toUpperCase().trim();
  return `${clean.slice(0,-3)} ${clean.slice(-3)}`;
}
export function rankClass(value, values, lowerIsBetter=true){
  const valid=values.filter(Number.isFinite); if(!Number.isFinite(value)||!valid.length)return '';
  const unique=[...new Set(valid)].sort((a,b)=>a-b); if(unique.length===1)return 'green';
  const min=unique[0], max=unique[unique.length-1];
  if(lowerIsBetter) return value===min?'green':value===max?'red':'orange';
  return value===max?'green':value===min?'red':'orange';
}
export function formatAge(date,now=new Date()){
  const ms=now-date;if(ms<0)return 'Just updated';const mins=Math.floor(ms/60000);
  if(mins<1)return 'Just updated';if(mins<60)return `${mins} minute${mins===1?'':'s'} ago`;
  const hrs=Math.floor(mins/60);if(hrs<24)return `${hrs} hour${hrs===1?'':'s'} ago`;
  const days=Math.floor(hrs/24);return days===1?'Yesterday':`${days} days ago`;
}
export function parseCsv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(field);field='';}else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}else field+=c;}
  if(field||row.length){row.push(field);rows.push(row);}const headers=rows.shift()||[];
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
export function rowPostcode(row){return row['forecourts.location.postcode']||row['forecourts.postcode']||row.postcode||'';}
export function rowLabel(row){return row['forecourts.trading_name']||row['forecourts.brand_name']||'Unnamed forecourt';}
export function findByPostcode(rows,postcode){
  const wanted=normalizePostcode(postcode);
  return rows.filter(r=>normalizePostcode(rowPostcode(r))===wanted && String(r['forecourts.permanent_closure']).toUpperCase()!=='TRUE')
    .map(r=>({nodeId:r['forecourts.node_id']||'',postcode:formatPostcode(rowPostcode(r)),tradingName:rowLabel(r),brandName:r['forecourts.brand_name']||''}));
}
export function selectStations(rows,configured){
  return configured.map(t=>{
    const row=rows.find(r=>t.nodeId ? r['forecourts.node_id']===t.nodeId : normalizePostcode(rowPostcode(r))===normalizePostcode(t.postcode));
    if(!row)return {...t,unavailable:true};
    const price=Number(row['forecourts.fuel_price.E10']);
    const rawTime=row['forecourts.price_submission_timestamp.E10']||row['forecourts.price_change_effective_timestamp.E10'];
    const updated=new Date(rawTime);
    return {...t,nodeId:row['forecourts.node_id']||t.nodeId,postcode:formatPostcode(rowPostcode(row)),price,updated,unavailable:!Number.isFinite(price)||Number.isNaN(updated.getTime())};
  });
}
export function sanitizeStations(value){
  if(!Array.isArray(value))return DEFAULT_STATIONS.map(x=>({...x}));
  return value.slice(0,MAX_STATIONS).filter(x=>x&&typeof x.displayName==='string'&&typeof x.postcode==='string').map(x=>({id:x.id||x.nodeId||`postcode:${normalizePostcode(x.postcode)}`,nodeId:x.nodeId||'',displayName:x.displayName.trim().slice(0,24)||x.tradingName||'Station',postcode:formatPostcode(x.postcode),tradingName:x.tradingName||''}));
}
