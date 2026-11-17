(()=>{'use strict';
const $=id=>document.getElementById(id), BASE=new URL('./',location.href), CACHE='eidos-offline-v2';
let catalog=[],busy=false,stop=false;
const fmt=n=>(n/1048576).toFixed(1)+' МБ';
const classOf=p=>{let m=p.match(/^classes\/(\d{1,2})\//);if(m)return m[1];m=p.match(/^grades\/(\d{1,2})(?:\/|\.)/);if(m)return m[1];m=p.match(/^lessons\/[^/]*-(\d{1,2})(?:\/|\.)/);if(m)return m[1];return null};
function chosen(){const scope=$('scope').value,choice=$('choice')?.value;if(scope==='all')return catalog;if(!choice)return [];return catalog.filter(x=>scope==='class'?classOf(x.path)===choice:(x.path===choice||x.path.startsWith(choice+'/')))}
function estimate(){const a=chosen();$('estimate').textContent=`${a.length} файлів · приблизно ${fmt(a.reduce((s,x)=>s+(x.bytes||0),0))}`}
function render(){const scope=$('scope').value,wrap=$('selection');wrap.replaceChildren();if(scope!=='all'){
const sel=document.createElement('select');sel.id='choice';sel.setAttribute('aria-label',scope==='class'?'Виберіть клас':'Виберіть розділ');
let options=scope==='class'?[...new Set(catalog.map(x=>classOf(x.path)).filter(Boolean))].sort((a,b)=>+a-+b):[...new Set(catalog.map(x=>x.path.split('/').slice(0,2).join('/')).filter(x=>x.includes('/')))].sort();
for(const v of options){const opt=document.createElement('option');opt.value=v;opt.textContent=scope==='class'?`${v} клас`:v;sel.append(opt)}sel.addEventListener('change',estimate);wrap.append(sel)}estimate()}
async function init(){try{if(!('serviceWorker'in navigator)||!('caches'in window))throw Error('Браузер не підтримує офлайн-кеш');
await navigator.serviceWorker.register('./service-worker.js',{scope:'./'});
const res=await fetch('./offline-catalog.json',{cache:'no-store'});if(!res.ok)throw Error('Каталог файлів: HTTP '+res.status);
catalog=await res.json();if(!Array.isArray(catalog))throw Error('Неправильний каталог');render();$('status').textContent='Готово до завантаження. Виберіть клас або розділ.';
}catch(err){$('status').textContent='Помилка підготовки: '+err.message;$('download').disabled=true}}
$('scope').addEventListener('change',render);
$('cancel').addEventListener('click',()=>{stop=true;$('status').textContent='Зупиняємо після поточного файлу…'});
$('download').addEventListener('click',async()=>{if(busy)return;const arr=chosen();if(!arr.length){$('status').textContent='Для цього вибору немає файлів.';return}busy=true;stop=false;$('download').disabled=true;$('cancel').disabled=false;
let ok=0,fail=0;const errors=[];$('progress').max=arr.length;$('progress').value=0;
try{const cache=await caches.open(CACHE);for(const x of arr){if(stop)break;try{const url=new URL(x.path,BASE);const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);await cache.put(url,response.clone());ok++}catch(err){fail++;if(errors.length<6)errors.push(`${x.path}: ${err.message}`)}$('progress').value=ok+fail;$('status').textContent=`Збережено ${ok} з ${arr.length} · помилок ${fail}`}
$('status').textContent=`${stop?'Зупинено':fail?'Частково завершено':'Завантаження завершено'}: ${ok} з ${arr.length} файлів. Помилок: ${fail}.`+(errors.length?'\n'+errors.join('\n'):'');
}catch(err){$('status').textContent='Помилка кешу: '+err.message+' (можливо, бракує місця)'}finally{busy=false;$('download').disabled=false;$('cancel').disabled=true}});
$('check').addEventListener('click',async()=>{try{const keys=await caches.keys(),names=keys.filter(x=>x.startsWith('eidos-offline-'));let count=0;for(const name of names){const cache=await caches.open(name);count+=(await cache.keys()).length}$('status').textContent=`Збережено ${count} ресурсів у ${names.length} кешах. Для повної офлайн-роботи перевірте потрібний урок у режимі польоту.`}catch(e){$('status').textContent='Помилка перевірки: '+e.message}});
init();})();
