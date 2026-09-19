const D={Pakistan:['PKR',2600],"United States":['USD',190],"United Kingdom":['GBP',175],UAE:['AED',150],"Saudi Arabia":['SAR',145],India:['INR',2100],Canada:['CAD',205],Australia:['AUD',215],Germany:['EUR',185],"South Africa":['ZAR',2300],Qatar:['QAR',145],Oman:['OMR',16]};
const mats=['Cement','Steel/Rebar','Bricks/Blocks','Sand','Gravel','Tiles','Paint','Electrical','Plumbing','Labor'];let country=document.querySelector('#country'),currency=document.querySelector('#currency');Object.keys(D).forEach(x=>{country.add(new Option(x,x));currency.add(new Option(D[x][0],D[x][0]))});country.value='Pakistan';currency.value='PKR';
const $=x=>document.querySelector(x), money=x=>new Intl.NumberFormat().format(Math.round(x));let current=null;
function calc(){let c=D[country.value],a=+$('#area').value||0,f=+$('#floors').value||1,u=$('#unit').value,q={basic:.82,standard:1,premium:1.28}[$('#quality').value],b={House:1,Commercial:1.18,Industrial:1.32,Government:1.12,Other:1.08}[$('#type').value];let mult=u==='sqm'?10.7639:u==='sqyd'?9:1,total=a*mult*f,avg=total*c[1]*q*b;return {c:c[0],low:avg*.85,avg,high:avg*1.18,total,a,f,u,city:$('#city').value||'Not specified',gov:$('#gov').checked};}
function show(r){if(!r)return;current=r;$('#low').textContent=r.c+' '+money(r.low);$('#avg').textContent=r.c+' '+money(r.avg);$('#high').textContent=r.c+' '+money(r.high);$('#meta').textContent=`${r.city} · ${country.value} · ${$('#type').value} · ${r.a} ${r.u} × ${r.f} floor(s)`;let ws=[.105,.16,.07,.045,.05,.10,.055,.085,.075,.255];$('#break').innerHTML=mats.map((m,i)=>`<div class="row"><span>${m}</span><b>${r.c} ${money(r.avg*ws[i])}</b></div>`).join('')+`<p class="note">Contingency/price variation is not a guaranteed tender rate.</p>`;$('#note').textContent=r.gov?'Government mode: official SOR/CSR/SSR rates must be verified from the relevant authority. No official rate is invented here.':'Preliminary market-style planning estimate. Supplier quotes, design, structure and site conditions can change the final cost.';}
$('#estimate').onclick=()=>show(calc());country.onchange=()=>currency.value=D[country.value][0];
$('#rates').innerHTML=mats.map((m,i)=>`<div class="rate"><b>${m}</b><small>Indicative/demo rate for ${country.value}; connect a verified local feed for live rates.</small></div>`).join('');
function hist(){let h=JSON.parse(localStorage.meHistory||'[]');$('#history').innerHTML=h.length?h.map((x,i)=>`<div class="history"><span><b>${x.city}</b><br><small>${x.date} · ${x.country}</small></span><b>${x.c} ${money(x.avg)}</b></div>`).join(''):'<p class="note">No saved estimates.</p>'}hist();$('#save').onclick=()=>{if(!current)return alert('Generate an estimate first');let h=JSON.parse(localStorage.meHistory||'[]');h.unshift({...current,country:country.value,date:new Date().toLocaleString()});localStorage.meHistory=JSON.stringify(h.slice(0,30));hist()};$('#print').onclick=()=>current?print():alert('Generate an estimate first');
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelector('#'+b.dataset.tab).classList.add('active');});
$('#file').onchange=e=>{let f=e.target.files[0];if(f)$('#preview').innerHTML=`<p class="note">Uploaded: <b>${f.name}</b> — ready for drawing analysis.</p>`};
$('#analyze').onclick=async()=>{let f=$('#file').files[0];if(!f)return alert('Upload a drawing/plan first.');$('#answer').textContent='Trying secure AI drawing analysis…';try{let data=await new Promise((res,rej)=>{if(!f.type.startsWith('image/'))return rej();let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});let x=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:'construction_drawing',image:data,country:country.value,city:$('#city').value})});if(x.ok){let j=await x.json();if(j.area_sqft)$('#area').value=Math.round(j.area_sqft);$('#answer').textContent=j.summary||'AI drawing analysis completed.';show(calc());return}}catch(e){}$('#answer').textContent='Drawing uploaded. No secure AI vision endpoint is connected yet, so the site will not invent dimensions. Enter/confirm the area, then generate the preliminary estimate. Connect worker.js for actual AI plan reading.';show(calc())};
$('#ask').onclick=async()=>{let q=$('#q').value.trim();if(!q)return;try{let x=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:'assistant',question:q,estimate:current})});if(x.ok){let j=await x.json();$('#answer').textContent=j.answer;return}}catch(e){}$('#answer').textContent=current?`Current rough range: ${current.c} ${money(current.low)} to ${money(current.high)}. This is preliminary, not a verified BOQ.`:'Generate an estimate first.'};
$('#tutorial').onclick=()=>alert('Welcome to My Estimateer 👋\n1 Location\n2 Building type\n3 Area/floors/quality\n4 Generate estimate\n5 Upload drawing for AI analysis\n6 Save history / PDF\n7 Government mode verifies official schedules instead of inventing rates.');

// ---------- Monetization: Free + Pro / Ad-Free ----------
const PAYMENT_CHECKOUT_URL = "https://example.com/REPLACE_WITH_YOUR_PAYMENT_LINK";
const PRO_KEY = "my_estimateer_pro";

function isPro(){ return localStorage.getItem(PRO_KEY) === "true"; }
function updatePlanUI(){
  const pro=isPro(), badge=document.getElementById("planBadge"), ad=document.getElementById("adSlot");
  const upgrade=document.getElementById("upgradeBtn"), top=document.getElementById("proBtn");
  if(!badge)return;
  badge.textContent=pro?"PRO · AD-FREE":"FREE";
  if(ad) ad.classList.toggle("hidden",pro);
  if(upgrade){upgrade.textContent=pro?"Pro Active":"Upgrade to Pro";upgrade.disabled=pro;}
  if(top) top.textContent=pro?"⭐ Pro Active":"⭐ Go Pro";
}
function startCheckout(){
  if(isPro()) return;
  if(PAYMENT_CHECKOUT_URL.includes("REPLACE_WITH_YOUR_PAYMENT_LINK")){
    alert("Payment is ready to connect, but the real checkout link has not been added yet. Add your payment-provider checkout link in PAYMENT_CHECKOUT_URL in app.js.");
    return;
  }
  location.href=PAYMENT_CHECKOUT_URL;
}
document.getElementById("upgradeBtn")?.addEventListener("click",startCheckout);
document.getElementById("proBtn")?.addEventListener("click",startCheckout);
updatePlanUI();
