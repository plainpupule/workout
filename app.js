const STORAGE_KEY='eightWeekFullBody.v1';
const state=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{week:1,travel:false,logs:{},bodyLogs:[],profile:{startDate:new Date().toISOString().slice(0,10)}};
const save=()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderStatus();};

const weekScheme={
  1:{label:'Foundation',sets:3,reps:'10–12',rir:'3 reps in reserve'},
  2:{label:'Build',sets:3,reps:'10–12',rir:'2–3 reps in reserve'},
  3:{label:'Overload',sets:4,reps:'8–12',rir:'2 reps in reserve'},
  4:{label:'Reset',sets:2,reps:'10',rir:'4 reps in reserve'},
  5:{label:'Strength + Shape',sets:4,reps:'8–10',rir:'2 reps in reserve'},
  6:{label:'Volume',sets:4,reps:'10–12',rir:'1–2 reps in reserve'},
  7:{label:'Peak',sets:4,reps:'6–10',rir:'1–2 reps in reserve'},
  8:{label:'Consolidate',sets:3,reps:'8–12',rir:'2 reps in reserve'}
};

const days=[
 {id:'d1',name:'Chest + Glutes Strength',tag:'CORE DAY 1',time:'60–75 min',ex:[
  ['Machine Chest Press','Chest','Neutral or semi-neutral grip; keep wrist stacked.','Push through the handles without bending the wrist back.','Dumbbell Floor Press'],
  ['Barbell Hip Thrust','Glutes','Pause one second at lockout.','Use a pad and keep ribs down.','Dumbbell Hip Thrust'],
  ['Incline Dumbbell Press','Upper chest','Use a comfortable grip angle.','Stop if the right hand cannot keep the dumbbell stable.','Incline Push-up'],
  ['Romanian Deadlift','Hamstrings + glutes','Use straps if cleared and grip limits the target muscles.','Hinge from the hips; keep weights close.','Dumbbell RDL'],
  ['Cable Glute Kickback','Glutes','Controlled reps; no low-back swing.','Drive the heel back.','Banded Kickback'],
  ['Pallof Press','Core','Anti-rotation core work.','Use a grip that does not provoke symptoms.','Dead Bug'] ]},
 {id:'d2',name:'Balanced Upper + Lower',tag:'CORE DAY 2',time:'55–70 min',ex:[
  ['Leg Press','Quads + glutes','Comfortable foot position and depth.','Do not force hip depth.','Goblet Squat'],
  ['Neutral-Grip Lat Pulldown','Back','Neutral handles are often easier on the wrist.','Lead with elbows; avoid death-gripping.','Band Pulldown'],
  ['Chest-Supported Row','Back','Support the torso and keep wrist straight.','Use straps only if already approved.','One-Arm Dumbbell Row'],
  ['Landmine Press','Shoulders + chest','Angled press can be wrist-friendly.','Keep forearm aligned with the handle.','Half-Kneeling Dumbbell Press'],
  ['Seated Hamstring Curl','Hamstrings','Slow lower.','Keep hips down.','Slider Hamstring Curl'],
  ['Cable Lateral Raise','Shoulders','Light and controlled.','A cuff attachment can reduce gripping.','Dumbbell Lateral Raise'] ]},
 {id:'d3',name:'Glutes + Chest Hypertrophy',tag:'CORE DAY 3',time:'60–75 min',ex:[
  ['Hack Squat or Smith Squat','Glutes + legs','Use the stance that lets your hips move smoothly.','Stop before pinching or sharp pain.','Goblet Squat'],
  ['Dumbbell Glute Bridge','Glutes','Higher-rep squeeze work.','Keep chin tucked and ribs down.','Bodyweight Glute Bridge'],
  ['Incline Machine Press','Upper chest','Stable setup for progressive overload.','Keep wrist centered over forearm.','Incline Push-up'],
  ['Cable Chest Fly','Chest','Soft elbows; controlled stretch.','Use wrist cuffs if gripping is uncomfortable.','Resistance-Band Fly'],
  ['Bulgarian Split Squat','Glutes + legs','Slight forward torso lean.','Hold one weight on the left if right grip is irritated.','Reverse Lunge'],
  ['Hip Abduction Machine','Glute medius','Pause open; control return.','Do not bounce.','Banded Lateral Walk'] ]},
 {id:'bonus',name:'Bonus: Pump + Mobility',tag:'OPTIONAL',time:'30–45 min',ex:[
  ['Cable or Machine Chest Press','Chest','Easy pump, not a max-effort day.','Leave 3 reps in reserve.','Push-up'],
  ['Frog Pump','Glutes','Continuous tension.','Short range is okay.','Glute Bridge'],
  ['Back Extension','Posterior chain','Round through upper back slightly and drive hips into pad.','Stop at neutral, not hyperextension.','Bird Dog'],
  ['Zone 2 Cardio','Conditioning','20–30 minutes conversational pace.','Bike or incline walk.','Brisk Walk'] ]}
];

const hipMobility=[
 ['90/90 Hip Switches','2 × 6/side','Move slowly; use hands behind you for support.'],
 ['Half-Kneeling Hip Flexor Stretch','2 × 30 sec/side','Tuck pelvis slightly; squeeze the back glute.'],
 ['Adductor Rock-Back','2 × 8/side','Keep spine long and rock hips back.'],
 ['Supported Deep Squat Hold','2 × 30 sec','Hold a rack or post; do not force depth.'],
 ['Figure-4 Glute Stretch','2 × 30 sec/side','Gentle stretch, no knee pressure.'],
 ['Couch Stretch','1–2 × 30 sec/side','Use padding and stay tall.']
];
const handMobility=[
 ['Tendon Glides','5 gentle cycles','Only movements approved by your surgeon or hand therapist.'],
 ['Finger Opposition','5 touches/finger','Touch thumb to each fingertip without forcing range.'],
 ['Wrist Flexion / Extension AROM','8 each direction','Active range only; no aggressive stretching.'],
 ['Forearm Pronation / Supination','8 each direction','Elbow near your side; move slowly.'],
 ['Soft Ball Squeeze','2 × 8','Very light effort; skip if it increases pain or swelling.']
];

function sessionKey(dayId){return `w${state.week}-${dayId}`}
function renderStatus(){
 document.getElementById('weekLabel').textContent=`${state.week} of 8`;
 const done=['d1','d2','d3'].filter(id=>state.logs[sessionKey(id)]?.completed).length;
 document.getElementById('weeklyProgress').textContent=`${done} / 3`;
 const vals=Object.values(state.logs).map(x=>Number(x.mobility)).filter(Boolean);
 document.getElementById('handTrend').textContent=vals.length?`${vals.at(-1)}/10`:'—';
 document.getElementById('travelToggle').classList.toggle('active',state.travel);
 document.getElementById('travelToggle').setAttribute('aria-pressed',String(state.travel));
}

function getExerciseName(ex){return state.travel?ex[4]:ex[0]}
function showWorkout(day){
 const panel=document.getElementById('today'); const key=sessionKey(day.id); const log=state.logs[key]||{exercises:{},pain:0,mobility:9,energy:7,notes:'',completed:false};
 panel.innerHTML=`<div class="hero"><span class="badge">${day.tag}</span><h2>${day.name}</h2><p class="muted">Week ${state.week}: ${weekScheme[state.week].label} · ${day.time} · ${weekScheme[state.week].rir}</p></div><div class="warning"><strong>Post-surgery guardrail:</strong> only use hand exercises and loading your surgeon or hand therapist has cleared. Stop for sharp pain, increasing swelling, numbness, or loss of control.</div><div id="exerciseList"></div><div class="card"><h3>Session check-in</h3><div class="metrics"><label>Right-hand pain (0–10)<input id="pain" type="number" min="0" max="10" value="${log.pain}"></label><label>Right-hand mobility (0–10)<input id="mobilityScore" type="number" min="0" max="10" value="${log.mobility}"></label><label>Energy (0–10)<input id="energy" type="number" min="0" max="10" value="${log.energy}"></label><label>Notes<textarea id="notes">${log.notes||''}</textarea></label></div><div class="actions"><button class="button" id="finishWorkout">Save & complete workout</button><button class="button secondary" id="backProgram">Back to program</button></div></div>`;
 const list=panel.querySelector('#exerciseList');
 day.ex.forEach((ex,i)=>{
  const node=document.getElementById('exerciseTemplate').content.cloneNode(true); const exlog=log.exercises[i]||{};
  node.querySelector('h3').textContent=getExerciseName(ex); node.querySelector('.exercise-tag').textContent=ex[1]; node.querySelector('.exercise-note').textContent=ex[2]; node.querySelector('.cue').textContent=ex[3];
  const complete=node.querySelector('.exercise-complete'); complete.checked=!!exlog.complete; complete.onchange=e=>updateExercise(key,i,'complete',e.target.checked);
  const sets=node.querySelector('.sets'); const count=day.id==='bonus'?2:weekScheme[state.week].sets;
  for(let s=0;s<count;s++){const r=(exlog.sets||[])[s]||{}; const row=document.createElement('div'); row.className='set-row'; row.innerHTML=`<span>Set ${s+1}</span><input inputmode="decimal" placeholder="Weight" value="${r.weight||''}" aria-label="Weight set ${s+1}"><input inputmode="numeric" placeholder="Reps (${day.id==='bonus'?'12–15':weekScheme[state.week].reps})" value="${r.reps||''}" aria-label="Reps set ${s+1}">`; const inputs=row.querySelectorAll('input'); inputs[0].oninput=e=>updateSet(key,i,s,'weight',e.target.value);inputs[1].oninput=e=>updateSet(key,i,s,'reps',e.target.value);sets.appendChild(row)}
  list.appendChild(node);
 });
 document.getElementById('finishWorkout').onclick=()=>{const l=state.logs[key]||{exercises:{}};Object.assign(l,{pain:+pain.value,mobility:+mobilityScore.value,energy:+energy.value,notes:notes.value,completed:true,date:new Date().toISOString()});state.logs[key]=l;save();alert('Workout saved. Nice work.');showWorkout(day)};
 document.getElementById('backProgram').onclick=()=>switchTab('program');
}
function updateExercise(key,i,field,val){state.logs[key]??={exercises:{}};state.logs[key].exercises[i]??={sets:[]};state.logs[key].exercises[i][field]=val;save()}
function updateSet(key,i,s,field,val){state.logs[key]??={exercises:{}};state.logs[key].exercises[i]??={sets:[]};state.logs[key].exercises[i].sets[s]??={};state.logs[key].exercises[i].sets[s][field]=val;save()}

function renderProgram(){
 const p=document.getElementById('program');p.innerHTML=`<div class="hero"><span class="badge">YOUR PLAN</span><h2>Three core days + one bonus</h2><p class="muted">Use any schedule that leaves at least one recovery day between demanding sessions when possible.</p></div><div class="week-selector">${[1,2,3,4,5,6,7,8].map(w=>`<button class="week-btn ${w===state.week?'active':''}" data-week="${w}">${w}</button>`).join('')}</div><div class="card"><strong>Week ${state.week}: ${weekScheme[state.week].label}</strong><p class="muted">${weekScheme[state.week].sets} working sets · ${weekScheme[state.week].reps} · ${weekScheme[state.week].rir}</p></div><div class="day-grid">${days.map(d=>`<article class="day-card ${state.logs[sessionKey(d.id)]?.completed?'complete':''}" data-day="${d.id}"><span class="badge">${d.tag}</span><h3>${d.name}</h3><p class="muted">${d.time} · ${d.ex.length} movements</p></article>`).join('')}</div>`;
 p.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{state.week=+b.dataset.week;save();renderProgram();renderProgress()});
 p.querySelectorAll('[data-day]').forEach(c=>c.onclick=()=>{showWorkout(days.find(d=>d.id===c.dataset.day));switchTab('today')});
}
function renderMobility(){
 const p=document.getElementById('mobility'); const cards=(items)=>items.map(x=>`<article class="mobility-card"><span class="badge">${x[1]}</span><h3>${x[0]}</h3><p class="muted">${x[2]}</p></article>`).join('');
 p.innerHTML=`<div class="hero"><span class="badge">10–15 MINUTES</span><h2>Open Hips + Restore the Hand</h2><p class="muted">Use the hip flow before training or as a separate recovery session. Keep hand work gentle and clinician-approved.</p></div><div class="card"><h2>Hip-opening flow</h2><div class="mobility-grid">${cards(hipMobility)}</div></div><div class="card"><h2>Right-hand mobility</h2><div class="mobility-grid">${cards(handMobility)}</div></div><div class="warning"><strong>Do not chase “100%” through pain.</strong> Range and strength after surgery should progress according to the procedure, healing stage, and guidance from your surgeon or certified hand therapist.</div>`;
}
function renderProgress(){
 const p=document.getElementById('progress'); const completed=Object.values(state.logs).filter(x=>x.completed).length; const mobility=Object.values(state.logs).map(x=>Number(x.mobility)).filter(Boolean); const bars=mobility.slice(-12).map(v=>`<div class="bar" style="height:${v*10}%" title="${v}/10"></div>`).join('');
 p.innerHTML=`<div class="hero"><span class="badge">PROGRESS</span><h2>${completed} workouts completed</h2><p class="muted">Your data stays on this device unless you export it or connect cloud sync later.</p></div><div class="card"><h3>Recent hand-mobility scores</h3><div class="chart">${bars||'<p class="muted">Complete a workout to start the chart.</p>'}</div></div><div class="card"><h3>Add body measurement</h3><div class="metrics"><label>Date<input id="measureDate" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Body weight<input id="bodyWeight" inputmode="decimal" placeholder="Optional"></label><label>Chest<input id="chestMeasure" inputmode="decimal" placeholder="Optional"></label><label>Hips / glutes<input id="hipMeasure" inputmode="decimal" placeholder="Optional"></label></div><button class="button" id="saveMeasure">Save measurement</button></div><div class="card"><h3>Measurement history</h3>${state.bodyLogs.length?state.bodyLogs.slice().reverse().map(x=>`<p><strong>${x.date}</strong> · Weight ${x.weight||'—'} · Chest ${x.chest||'—'} · Hips ${x.hips||'—'}</p>`).join(''):'<p class="muted">No measurements yet.</p>'}</div>`;
 document.getElementById('saveMeasure').onclick=()=>{state.bodyLogs.push({date:measureDate.value,weight:bodyWeight.value,chest:chestMeasure.value,hips:hipMeasure.value});save();renderProgress()};
}
function renderSettings(){
 const p=document.getElementById('settings');p.innerHTML=`<div class="hero"><span class="badge">DATA</span><h2>Backup and move your results</h2><p class="muted">Export a JSON backup to GitHub, Drive, or your phone. Import it on another device to restore your history.</p></div><div class="card"><div class="actions"><button class="button" id="exportData">Export results</button><label class="button secondary">Import results<input id="importData" type="file" accept="application/json" hidden></label><button class="button danger" id="resetData">Reset all data</button></div></div><div class="card"><h3>GitHub Pages deployment</h3><p>Upload these files to a repository, open <strong>Settings → Pages</strong>, choose <strong>Deploy from a branch</strong>, and select the main branch root.</p><p class="muted small">Cloud sync can be added later with Supabase. Never place a Supabase service-role key in this front-end.</p></div>`;
 document.getElementById('exportData').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`workout-results-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)};
 document.getElementById('importData').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);localStorage.setItem(STORAGE_KEY,JSON.stringify(data));location.reload()}catch{alert('That file is not a valid backup.')}};r.readAsText(f)};
 document.getElementById('resetData').onclick=()=>{if(confirm('Delete all locally saved workout results?')){localStorage.removeItem(STORAGE_KEY);location.reload()}};
}
function switchTab(id){document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));if(id==='program')renderProgram();if(id==='mobility')renderMobility();if(id==='progress')renderProgress();if(id==='settings')renderSettings()}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>switchTab(t.dataset.tab));
document.getElementById('travelToggle').onclick=()=>{state.travel=!state.travel;save();renderProgram();const active=document.querySelector('#today .hero h2');if(active){const d=days.find(x=>x.name===active.textContent);if(d)showWorkout(d)}};
renderStatus();renderProgram();renderMobility();renderProgress();renderSettings();showWorkout(days[0]);
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
