export const TARGETS = [
  { displayName: 'Esso', postcode: 'SK8 2AJ' },
  { displayName: 'Morrisons', postcode: 'SK3 0RL' },
  { displayName: 'Tesco', postcode: 'SK1 2BT' },
  { displayName: 'Work', postcode: 'OL7 0NS' }
];

export function normalizePostcode(value=''){ return value.toUpperCase().replace(/\s+/g,'').trim(); }
export function rankClass(value, values, lowerIsBetter=true){
  const valid = values.filter(Number.isFinite);
  if (!Number.isFinite(value) || !valid.length) return '';
  const unique = [...new Set(valid)].sort((a,b)=>a-b);
  if (unique.length === 1) return 'green';
  const idx = unique.indexOf(value);
  if (lowerIsBetter) return idx===0?'green':idx===unique.length-1?'red':'orange';
  return idx===unique.length-1?'green':idx===0?'red':'orange';
}
export function formatAge(date, now=new Date()){
  const ms = now-date; if(ms<0) return 'Just updated';
  const mins=Math.floor(ms/60000); if(mins<1)return 'Just updated'; if(mins<60)return `${mins} minute${mins===1?'':'s'} ago`;
  const hrs=Math.floor(mins/60); if(hrs<24)return `${hrs} hour${hrs===1?'':'s'} ago`;
  const days=Math.floor(hrs/24); return days===1?'Yesterday':`${days} days ago`;
}
export function parseCsv(text){
  const rows=[]; let row=[], field='', quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}
    else if(c==='"')quoted=true; else if(c===','){row.push(field);field='';}
    else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';} else field+=c;
  }
  if(field||row.length){row.push(field);rows.push(row);} const headers=rows.shift()||[];
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
export function selectStations(rows){
  return TARGETS.map(t=>{
    const row=rows.find(r=>normalizePostcode(r['forecourts.location.postcode']||r['forecourts.postcode']||r.postcode)===normalizePostcode(t.postcode));
    if(!row) return {...t, unavailable:true};
    const price=Number(row['forecourts.fuel_price.E10']||row.E10||row.e10);
    const rawTime=row['forecourts.price_submission_timestamp.E10']||row['forecourts.price_change_effective_timestamp.E10']||row.e10_timestamp;
    const updated=new Date(rawTime);
    return {...t, price, updated, nodeId:row['forecourts.node_id']||row.node_id, unavailable:!Number.isFinite(price)||Number.isNaN(updated.getTime())};
  });
}
