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


const exerciseGuides={
 'Machine Chest Press':[['Set the seat so the handles line up with mid-chest.','Plant your feet, brace your torso, and keep wrists stacked.','Press smoothly, stop just short of locking out, then return under control.'],'Avoid shrugging or letting the wrists bend backward.'],
 'Barbell Hip Thrust':[['Place your upper back on the bench and the bar across the hip crease.','Tuck the chin, brace the ribs, and drive through the heels.','Finish with glutes squeezed and shins nearly vertical; lower slowly.'],'Do not overarch the lower back at the top.'],
 'Incline Dumbbell Press':[['Set the bench to a low incline and begin with dumbbells over the upper chest.','Keep shoulder blades gently pulled back and wrists neutral.','Lower until elbows are slightly below the torso, then press up and inward.'],'Do not flare the elbows straight out or lose wrist control.'],
 'Romanian Deadlift':[['Stand tall with weights close to the thighs and knees softly bent.','Push the hips back while keeping the spine long.','Stop when the hamstrings are loaded, then drive the hips forward.'],'Do not squat the weight or let it drift away from your legs.'],
 'Cable Glute Kickback':[['Attach an ankle strap and hold the machine for balance.','Brace the core and keep the working knee slightly bent.','Drive the heel back without twisting, pause, then return slowly.'],'Do not swing through the lower back.'],
 'Pallof Press':[['Stand sideways to the cable with the handle at chest height.','Brace the core and press the hands straight forward.','Resist rotation, pause, and bring the handle back in.'],'Do not let the hips or shoulders turn toward the cable.'],
 'Leg Press':[['Place feet about shoulder-width on the platform.','Lower with control while keeping the pelvis and back supported.','Push through the whole foot and stop short of locking the knees.'],'Do not force a depth that causes the hips to tuck or pinch.'],
 'Neutral-Grip Lat Pulldown':[['Sit tall with thighs secured and take a neutral grip.','Draw the shoulders down, then pull the elbows toward the ribs.','Pause near the upper chest and return with control.'],'Do not lean far back or pull with the hands alone.'],
 'Chest-Supported Row':[['Set the bench so your chest stays supported throughout.','Begin with arms long and shoulder blades relaxed.','Pull elbows back, squeeze the upper back, then lower slowly.'],'Do not crane the neck or shrug toward the ears.'],
 'Landmine Press':[['Hold the end of the bar near the shoulder in a split or half-kneeling stance.','Brace the core and keep the wrist in line with the forearm.','Press up and forward, then return slowly to the shoulder.'],'Do not twist the torso or bend the wrist around the handle.'],
 'Seated Hamstring Curl':[['Adjust the pad just above the heels and secure the thighs.','Curl the heels down and back while keeping the hips planted.','Squeeze briefly, then control the return.'],'Do not bounce or lift the hips from the seat.'],
 'Cable Lateral Raise':[['Stand side-on to the cable with the handle in the far hand.','Keep a soft elbow and raise the arm in a slight forward angle.','Stop around shoulder height and lower slowly.'],'Do not shrug or swing the body.'],
 'Hack Squat or Smith Squat':[['Choose a stance that lets the knees track comfortably over the toes.','Brace the torso and descend under control.','Drive through the mid-foot and stand without snapping the knees.'],'Do not force depth if the hips pinch or the pelvis tucks.'],
 'Dumbbell Glute Bridge':[['Lie on your back with feet planted and weight across the hips.','Brace the ribs and gently tuck the pelvis.','Drive through the heels, squeeze the glutes, and lower slowly.'],'Do not push the movement into the lower back.'],
 'Incline Machine Press':[['Adjust the seat so handles align with the upper chest.','Set the shoulder blades and keep wrists centered.','Press smoothly, pause near extension, and return under control.'],'Do not let the shoulders roll forward at the bottom.'],
 'Cable Chest Fly':[['Set handles slightly below shoulder height and step into a staggered stance.','Keep a soft elbow and open the chest without overstretching.','Bring the hands together in a wide arc, squeeze, then return slowly.'],'Do not turn it into a press or let the shoulders dump forward.'],
 'Bulgarian Split Squat':[['Place the rear foot on a bench and the front foot far enough forward for balance.','Lean slightly forward and lower the back knee toward the floor.','Drive through the front foot to stand.'],'Do not push off the rear leg or let the front knee collapse inward.'],
 'Hip Abduction Machine':[['Sit tall or lean slightly forward with the pads outside the knees.','Brace the torso and press the knees outward.','Pause at the open position and return slowly.'],'Do not bounce the stack or let the knees snap inward.'],
 'Cable or Machine Chest Press':[['Set the handles at mid-chest height and take a stable stance or seat.','Brace the torso and keep the wrists neutral.','Press forward smoothly and return until the chest is comfortably stretched.'],'Do not shrug or overextend the shoulders.'],
 'Frog Pump':[['Lie on your back with soles of the feet together and knees open.','Tuck the pelvis and brace the ribs.','Drive the hips up, squeeze the glutes, and use a controlled rhythm.'],'Do not arch the lower back to create more height.'],
 'Back Extension':[['Set the pad just below the hip crease and anchor the feet.','Hinge forward with a long spine.','Drive the hips into the pad and rise only to a neutral body line.'],'Do not hyperextend or throw the torso upward.'],
 'Zone 2 Cardio':[['Choose a bike, incline walk, or elliptical.','Move at a pace where you can speak in short sentences.','Keep the effort steady for 20–30 minutes.'],'Do not turn the session into repeated hard intervals.'],
 'Dumbbell Floor Press':[['Lie on the floor with knees bent and dumbbells over the chest.','Keep wrists stacked and upper arms about 30–45 degrees from the torso.','Lower until the upper arms touch the floor, then press up smoothly.'],'Do not bounce the elbows off the floor.'],
 'Dumbbell Hip Thrust':[['Set the upper back on a bench and place a dumbbell across the hips.','Brace the ribs and drive through the heels.','Squeeze the glutes at the top and lower with control.'],'Do not overarch the lower back.'],
 'Incline Push-up':[['Place hands on a bench or bar slightly wider than shoulders.','Keep the body in a straight line and wrists as comfortable as possible.','Lower the chest toward the support, then press away.'],'Raise the incline or use handles if the right hand is uncomfortable.'],
 'Dumbbell RDL':[['Hold dumbbells close to the thighs with knees softly bent.','Push the hips back while keeping the spine long.','Stand by driving the hips forward and squeezing the glutes.'],'Do not round the back or turn it into a squat.'],
 'Banded Kickback':[['Anchor a band low and loop it around the ankle.','Brace the torso and keep the standing leg soft.','Drive the heel back, pause, and return slowly.'],'Do not rotate the pelvis.'],
 'Dead Bug':[['Lie on your back with hips and knees at 90 degrees.','Press the lower back gently into the floor.','Extend opposite arm and leg without losing trunk position, then switch.'],'Do not let the ribs flare or low back arch.'],
 'Goblet Squat':[['Hold one dumbbell at chest height and set the feet comfortably.','Brace and sit down between the hips.','Drive through the whole foot to stand.'],'Do not let the knees collapse inward or force hip depth.'],
 'Band Pulldown':[['Anchor the band overhead and sit or kneel tall.','Set the shoulders down and pull elbows toward the ribs.','Pause, then slowly allow the arms to lengthen.'],'Do not lean back excessively.'],
 'One-Arm Dumbbell Row':[['Support one hand and knee on a bench.','Keep the torso square and the working wrist neutral.','Pull the elbow toward the hip and lower slowly.'],'Do not twist the torso to move the weight.'],
 'Half-Kneeling Dumbbell Press':[['Kneel with the opposite foot forward and hold the dumbbell at shoulder height.','Brace the glute and core.','Press overhead without leaning back, then lower slowly.'],'Do not flare the ribs or bend the wrist backward.'],
 'Slider Hamstring Curl':[['Lie on your back with heels on sliders or towels.','Lift the hips and brace the torso.','Slide the heels away and curl them back while keeping hips lifted.'],'Do not let the hips sag.'],
 'Dumbbell Lateral Raise':[['Stand tall with light dumbbells at the sides.','Raise the arms slightly forward of the body with soft elbows.','Stop near shoulder height and lower slowly.'],'Do not swing or shrug.'],
 'Glute Bridge':[['Lie on your back with feet flat and knees bent.','Tuck the pelvis slightly and brace the ribs.','Drive through the heels, squeeze the glutes, and lower slowly.'],'Do not arch the lower back.'],
 'Resistance-Band Fly':[['Anchor the band behind you around chest height.','Step forward, brace, and keep elbows softly bent.','Bring the hands together in a wide arc and return slowly.'],'Do not let the shoulders roll forward.'],
 'Reverse Lunge':[['Stand tall and step one foot backward.','Lower both knees while keeping most pressure through the front foot.','Drive through the front leg to return to standing.'],'Do not push hard off the rear foot.'],
 'Banded Lateral Walk':[['Place a mini band above the knees or at the ankles.','Soften the knees and keep the pelvis level.','Take controlled side steps without letting the feet snap together.'],'Do not sway the torso or turn the toes outward.'],
 'Push-up':[['Set hands under or slightly wider than shoulders.','Brace the body in one straight line.','Lower the chest under control and press the floor away.'],'Use handles or an incline if wrist extension bothers the right hand.'],
 'Bird Dog':[['Start on hands and knees with the spine neutral.','Brace the core and extend opposite arm and leg.','Pause without rotating, return, and switch sides.'],'Do not arch the lower back or shift the hips.'],
 'Brisk Walk':[['Stand tall and begin at an easy pace.','Build to a purposeful speed while keeping breathing controlled.','Maintain a steady rhythm for the planned time.'],'Do not turn it into a painful or breathless effort.']
};
function getGuide(name){
 const g=exerciseGuides[name]||[['Set up in a stable position.','Move through a comfortable range with controlled form.','Stop the set before technique or hand control breaks down.'],'Avoid rushing, bouncing, or forcing painful range.'];
 return {steps:g[0],mistake:g[1],url:`https://www.youtube.com/results?search_query=${encodeURIComponent(name+' exercise proper form')}`};
}

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

function equipmentType(name){
 const n=name.toLowerCase();
 if(n.includes('leg press')) return ['legpress','Leg press machine'];
 if(n.includes('hack squat')||n.includes('smith')) return ['smith','Smith / hack squat station'];
 if(n.includes('chest press')||n.includes('machine press')||n.includes('incline machine')) return ['press','Chest press machine'];
 if(n.includes('lat pulldown')||n.includes('pulldown')) return ['pulldown','Lat pulldown station'];
 if(n.includes('cable')||n.includes('pallof')) return ['cable','Cable tower'];
 if(n.includes('hip abduction')) return ['abduction','Hip abduction machine'];
 if(n.includes('hamstring curl')) return ['curl','Seated hamstring curl machine'];
 if(n.includes('landmine')) return ['landmine','Landmine press setup'];
 if(n.includes('row')&&n.includes('supported')) return ['row','Chest-supported row bench'];
 if(n.includes('barbell')||n.includes('smith')) return ['barbell','Barbell and bench'];
 if(n.includes('dumbbell')||n.includes('goblet')||n.includes('bulgarian')||n.includes('reverse lunge')) return ['dumbbell','Dumbbells and bench'];
 if(n.includes('band')) return ['band','Resistance band'];
 if(n.includes('bike')||n.includes('cardio')||n.includes('walk')) return ['cardio','Cardio equipment'];
 if(n.includes('back extension')) return ['extension','Back extension bench'];
 if(n.includes('push-up')||n.includes('dead bug')||n.includes('bird dog')||n.includes('frog pump')||n.includes('glute bridge')) return ['mat','Exercise mat'];
 return ['dumbbell','Gym equipment'];
}
function equipmentSvg(name){
 const [type,label]=equipmentType(name);
 const common=`viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a3e635"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".28"/></filter></defs><rect width="420" height="190" rx="24" fill="#0b1020"/><path d="M24 154H396" stroke="#334155" stroke-width="3" stroke-linecap="round"/>`;
 const art={
 press:`<g filter="url(#s)" stroke="url(#g)" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M100 150V54h44v96M100 82h44M144 70l68 22M212 92v58M196 108h58M254 108v42M212 122l-34 22M254 122l35 20"/><circle cx="177" cy="144" r="8" fill="#a3e635" stroke="none"/></g>`,
 legpress:`<g filter="url(#s)" stroke="url(#g)" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M92 150h88l42-75h78M145 150l38-65h46M222 75l48-32M270 43l46 30M292 55l-44 70M248 125h58"/><circle cx="205" cy="119" r="10" fill="#a3e635" stroke="none"/></g>`,
 smith:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M94 150V38M300 150V38M94 38h206M116 72h162M132 72v78M262 72v78M158 118h78M180 118v32M214 118v32"/><circle cx="116" cy="72" r="8" fill="#8b5cf6" stroke="none"/><circle cx="278" cy="72" r="8" fill="#8b5cf6" stroke="none"/></g>`,
 pulldown:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M110 150V38h172v112M196 38v42M150 78h92M196 80v18M152 116h88M172 116v34M220 116v34"/><path d="M154 78l-20 15M238 78l20 15"/></g>`,
 cable:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M106 150V38h208v112M132 58h54v72h-54zM234 58h54v72h-54zM186 55h48M210 55v65M210 120l-27 22M210 120l27 22"/><circle cx="210" cy="120" r="7" fill="#a3e635" stroke="none"/></g>`,
 abduction:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M128 150V90h96l36 24v36M144 106h64M224 90V54M224 54h52M160 116l-28 24M202 116l28 24"/><circle cx="181" cy="115" r="9" fill="#a3e635" stroke="none"/></g>`,
 curl:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M120 150V92h92l42 22v36M138 108h58M212 92V52h54M198 116l26 22M224 138h60"/><circle cx="197" cy="116" r="8" fill="#a3e635" stroke="none"/></g>`,
 row:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M98 150h224M142 150l34-70h68l34 70M176 80l-36 28M244 80l36 28M156 108h108M210 108v42"/></g>`,
 barbell:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M90 74h240M120 62v24M142 56v36M278 56v36M300 62v24M132 146h156M160 146v-38h100v38"/></g>`,
 dumbbell:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M120 95h180M138 73v44M160 64v62M260 64v62M282 73v44M128 146h164M158 146v-28h104v28"/></g>`,
 band:`<g filter="url(#s)" stroke="url(#g)" stroke-width="10" fill="none" stroke-linecap="round"><path d="M112 60c76 0 45 82 98 82s21-82 98-82"/><circle cx="112" cy="60" r="13"/><circle cx="308" cy="60" r="13"/></g>`,
 landmine:`<g filter="url(#s)" stroke="url(#g)" stroke-width="9" fill="none" stroke-linecap="round"><path d="M104 150l42-12L306 54M94 150h70M286 46l32 16M166 126l28 32M214 99l28 32"/><circle cx="306" cy="54" r="10" fill="#a3e635" stroke="none"/></g>`,
 cardio:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="150" cy="126" r="34"/><circle cx="270" cy="126" r="34"/><path d="M150 126l46-58 30 58h-76l46-58h38M234 68h36M196 68l-18-24"/></g>`,
 extension:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linecap="round"><path d="M94 150h232M142 150l42-75h72l42 75M184 75l-38 20M256 75l38 20M196 102h48"/></g>`,
 mat:`<g filter="url(#s)" stroke="url(#g)" stroke-width="8" fill="none" stroke-linejoin="round"><path d="M92 136l52-82h184l-52 82zM144 54l46 82"/><circle cx="253" cy="89" r="18"/><path d="M235 112l-38 20M269 111l28 20"/></g>`
 };
 return `<div class="equipment-art">${common}${art[type]||art.dumbbell}</svg><div class="equipment-caption"><span>Equipment preview</span><strong>${label}</strong></div></div>`;
}

function showWorkout(day){
 const panel=document.getElementById('today'); const key=sessionKey(day.id); const log=state.logs[key]||{exercises:{},pain:0,mobility:9,energy:7,notes:'',completed:false};
 panel.innerHTML=`<div class="hero"><span class="badge">${day.tag}</span><h2>${day.name}</h2><p class="muted">Week ${state.week}: ${weekScheme[state.week].label} · ${day.time} · ${weekScheme[state.week].rir}</p></div><div class="warning"><strong>Post-surgery guardrail:</strong> only use hand exercises and loading your surgeon or hand therapist has cleared. Stop for sharp pain, increasing swelling, numbness, or loss of control.</div><div id="exerciseList"></div><div class="card"><h3>Session check-in</h3><div class="metrics"><label>Right-hand pain (0–10)<input id="pain" type="number" min="0" max="10" value="${log.pain}"></label><label>Right-hand mobility (0–10)<input id="mobilityScore" type="number" min="0" max="10" value="${log.mobility}"></label><label>Energy (0–10)<input id="energy" type="number" min="0" max="10" value="${log.energy}"></label><label>Notes<textarea id="notes">${log.notes||''}</textarea></label></div><div class="actions"><button class="button" id="finishWorkout">Save & complete workout</button><button class="button secondary" id="backProgram">Back to program</button></div></div>`;
 const list=panel.querySelector('#exerciseList');
 day.ex.forEach((ex,i)=>{
  const node=document.getElementById('exerciseTemplate').content.cloneNode(true); const exlog=log.exercises[i]||{};
  const displayName=getExerciseName(ex); const guide=getGuide(displayName);
  const visual=node.querySelector('.exercise-visual'); visual.innerHTML=equipmentSvg(displayName); visual.setAttribute('aria-label',`${displayName} equipment illustration`);
  node.querySelector('h3').textContent=displayName; node.querySelector('.exercise-tag').textContent=ex[1]; node.querySelector('.exercise-note').textContent=ex[2]; node.querySelector('.cue').textContent=ex[3];
  node.querySelector('.steps').innerHTML=guide.steps.map(step=>`<li>${step}</li>`).join('');
  node.querySelector('.mistake').innerHTML=`<strong>Watch for:</strong> ${guide.mistake}`;
  const demo=node.querySelector('.demo-link'); demo.href=guide.url; demo.setAttribute('aria-label',`Watch a ${displayName} exercise demo`);
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
