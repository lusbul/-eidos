const $=id=>document.getElementById(id);let submitted=false;let score=0;const questions=[
{type:'single',q:'Які частинки забезпечують електропровідність водних розчинів електролітів?',options:['Молекули води','Рухомі йони','Нейтральні атоми','Кристалічні зерна'],answer:1,why:'У розчинах електролітів заряд переносять катіони й аніони.'},
{type:'single',q:'Яка речовина є неелектролітом у водному розчині?',options:['Натрій хлорид','Хлоридна кислота','Сахароза','Натрій гідроксид'],answer:2,why:'Сахароза розчиняється молекулярно, без утворення йонів.'},
{type:'single',q:'Яке рівняння дисоціації Na₂SO₄ правильне?',options:['Na₂SO₄ → Na²⁺ + SO₄²⁻','Na₂SO₄ → 2Na⁺ + SO₄²⁻','Na₂SO₄ → 2Na⁻ + SO₄²⁺','Na₂SO₄ → Na⁺ + SO₄⁻'],answer:1,why:'У формульній одиниці два йони Na⁺ та один SO₄²⁻.'},
{type:'single',q:'Яка з наведених речовин є сильною кислотою?',options:['CH₃COOH','H₂CO₃','HCl','H₂S'],answer:2,why:'HCl у воді практично повністю дисоціює.'},
{type:'multi',q:'Оберіть усі речовини, водні розчини яких добре проводять електричний струм.',options:['NaCl','Глюкоза','HCl','KOH'],answer:[0,2,3],why:'Розчини NaCl, HCl і KOH містять багато рухомих йонів.'},
{type:'single',q:'Який йон утворюється під час дисоціації кислот і визначає їхні кислотні властивості?',options:['Na⁺','H⁺ (у воді — H₃O⁺)','Cl⁻','OH⁻'],answer:1,why:'У воді протон приєднується до молекули води, утворюючи H₃O⁺.'},
{type:'single',q:'Яка пара розчинів під час змішування утворює осад AgCl?',options:['AgNO₃ та NaCl','NaCl та KNO₃','HCl та NaOH','NaOH та KCl'],answer:0,why:'Ag⁺ + Cl⁻ → AgCl↓.'},
{type:'text',q:'Допишіть формулу йона: CaCl₂ → Ca²⁺ + 2 ____',answer:['Cl-','Cl⁻'],why:'Кальцій хлорид утворює один катіон Ca²⁺ і два аніони Cl⁻.'},
{type:'single',q:'Що відбувається під час нейтралізації сильної кислоти сильною основою?',options:['Утворюється лише газ','H⁺ + OH⁻ → H₂O','Осад утворюється завжди','Речовини не реагують'],answer:1,why:'Скорочене йонне рівняння: H⁺ + OH⁻ → H₂O.'},
{type:'single',q:'Яка ознака реакції Na₂CO₃ із HCl?',options:['Випадання срібного осаду','Виділення вуглекислого газу','Утворення синього розчину','Відсутність змін у розчині'],answer:1,why:'Карбонат з кислотою утворює CO₂, воду та сіль.'},
{type:'single',q:'Чому розчин етанової кислоти проводить струм слабше, ніж розчин HCl за однакової молярної концентрації?',options:['Має більшу густину','Містить менше йонів','Не містить молекул води','Має інший колір'],answer:1,why:'Етанова кислота — слабкий електроліт і дисоціює частково.'},
{type:'match',q:'Установіть відповідність: катіон, аніон, неелектроліт.',items:[['Катіон','Na⁺'],['Аніон','SO₄²⁻'],['Неелектроліт','Сахароза']],options:['Na⁺','SO₄²⁻','Сахароза'],why:'Катіони мають позитивний заряд, аніони — негативний; сахароза не утворює йонів.'}
];
function render(){const wrap=$('questions');questions.forEach((x,i)=>{let el=document.createElement('article');el.className='question';el.id='q'+i;let html=`<h3>${i+1}. ${x.q}</h3><div class="options">`;if(x.type==='single'||x.type==='multi')html+=x.options.map((o,j)=>`<label><input type="${x.type==='multi'?'checkbox':'radio'}" name="q${i}" value="${j}"> ${o}</label>`).join('');if(x.type==='text')html+=`<label>Відповідь: <input type="text" id="a${i}" placeholder="Наприклад, Cl-"></label>`;if(x.type==='match')html+=x.items.map((it,j)=>`<label>${it[0]} <select id="m${i}_${j}"><option value="">Оберіть</option>${x.options.map((o,k)=>`<option value="${k}">${o}</option>`).join('')}</select></label>`).join('');el.innerHTML=html+'</div>';wrap.appendChild(el)});wrap.addEventListener('change',progress);wrap.addEventListener('input',progress)}
function value(x,i){if(x.type==='single')return document.querySelector(`input[name=q${i}]:checked`)?.value;if(x.type==='multi')return [...document.querySelectorAll(`input[name=q${i}]:checked`)].map(n=>+n.value).sort((a,b)=>a-b);if(x.type==='text')return $('a'+i).value.trim().replace(/\s+/g,'');return x.items.map((_,j)=>$('m'+i+'_'+j).value)}
function answered(x,v){return x.type==='multi'?v.length>0:x.type==='match'?v.every(a=>a!==''):v!==undefined&&v!==''}
function progress(){let n=questions.filter((x,i)=>answered(x,value(x,i))).length;$('progress').textContent=`Виконано: ${n}/12`;$('progressFill').style.width=n/12*100+'%'}
function check(x,v){if(x.type==='single')return +v===x.answer;if(x.type==='multi')return JSON.stringify(v)===JSON.stringify(x.answer);if(x.type==='text')return x.answer.map(s=>s.toLowerCase()).includes(v.toLowerCase());return v.every((a,j)=>+a===j)}
$('finish').onclick=()=>{if(submitted)return;const missing=questions.filter((x,i)=>!answered(x,value(x,i))).length;if(missing&&!confirm(`Не виконано ${missing} завдань. Завершити перевірку?`))return;submitted=true;score=0;questions.forEach((x,i)=>{const el=$('q'+i),ok=check(x,value(x,i));score+=ok?1:0;el.classList.add(ok?'correct':'wrong');const p=document.createElement('p');p.className='feedback';p.textContent=(ok?'✓ Правильно. ':'✗ Потрібно повторити. ')+x.why;el.appendChild(p);el.querySelectorAll('input,select').forEach(n=>n.disabled=true)});const grade=Math.round(score/12*100);$('results').hidden=false;$('results').innerHTML=`<h2>Ваш результат: ${score} із 12 (${grade}%)</h2><p>Правильні відповіді та пояснення показано під кожним завданням. Перегляньте помилки та сформулюйте висновок.</p>`;$('finish').disabled=true;$('finish').textContent='Перевірку завершено';$('results').scrollIntoView({behavior:'smooth',block:'center'})};
$('theoryBtn').onclick=()=>{const show=$('theory').hidden;$('theory').hidden=!show;$('theoryBtn').setAttribute('aria-expanded',String(show));$('theoryBtn').textContent=show?'Сховати ключові слова ▴':'Ключові слова ▾'};
$('concentration').oninput=()=>{$('cvalue').textContent=$('concentration').value};
function resetSimulation(){const bulb=$('bulb');bulb.className='bulb';bulb.style.removeProperty('--glow');bulb.setAttribute('aria-label','Лампочка вимкнена');$('particles').replaceChildren();$('simResult').textContent='Оберіть умови й запустіть дослід.'}
$('substance').addEventListener('change',resetSimulation);
$('concentration').addEventListener('input',()=>{$('cvalue').textContent=$('concentration').value;resetSimulation()});
$('run').onclick=()=>{
 const kind=$('substance').value,c=+$('concentration').value;
 const strength={salt:1,sugar:0,acid:1,vinegar:.07,water:0}[kind];
 const intensity=c*strength;
 const level=intensity<0.5?'off':intensity<15?'dim':'bright';
 const on=level!=='off';const bulb=$('bulb');
 bulb.className='bulb '+level;
 bulb.style.setProperty('--glow',String(Math.min(1,intensity/65)));
 bulb.setAttribute('aria-label',level==='bright'?'Лампочка світиться яскраво':level==='dim'?'Лампочка світиться тьмяно':'Лампочка вимкнена');
 const particles=$('particles');particles.replaceChildren();
 const count=Math.min(30,Math.max(on?4:0,Math.round(intensity/3)));
 for(let i=0;i<count;i++){
  const ion=document.createElement('span');ion.className='ion '+(i%2?'anion':'cation');
  ion.textContent=i%2?'−':'+';
  ion.style.left=(12+(i*37)%76)+'%';ion.style.top=(27+(i*29)%59)+'%';
  ion.style.animationDelay=(-(i*0.31))+'s';particles.appendChild(ion);
 }
 const predicted=$('prediction').value==='yes';
 const status=level==='bright'?'Лампочка світиться яскраво':level==='dim'?'Лампочка світиться тьмяно':'Лампочка не світиться';
 const explanation=kind==='sugar'?'Сахароза не утворює йонів.':kind==='vinegar'?'Етанова кислота — слабкий електроліт, вона дисоціює частково.':kind==='water'?'Дистильована вода проводить струм надзвичайно слабко.':c===0?'За нульової концентрації розчиненої речовини провідність практично відсутня.':'Рухомі йони переносять електричний заряд.';
 $('simResult').textContent=`${status}. ${predicted===on?'Ваш прогноз підтвердився.':'Ваш прогноз не підтвердився.'} ${explanation}`;
};
$('pdf').onclick=()=>{if(!submitted){alert('Спочатку завершіть контрольну роботу, щоб результат потрапив до PDF.');return}const n=$('student').value.trim()||'Учень / учениця';const existing=$('printDetails');if(existing)existing.remove();const info=document.createElement('div');info.id='printDetails';info.innerHTML=`<h2>Підсумок учня</h2><p><strong>Ім’я:</strong> ${escapeHtml(n)}</p><p><strong>Результат:</strong> ${score}/12 (${Math.round(score/12*100)}%)</p><p><strong>Висновок:</strong> ${escapeHtml($('reflection').value)}</p>`;$('results').appendChild(info);window.print()};function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}render();