let S={score:0,round:0,brain:100,flags:0,streak:0,mode:"mix",used:{},answers:[],muted:false,ach:new Set(),textMode:false,current:null};
const $=x=>document.getElementById(x);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active")}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1600)}
function beep(f=220,d=.06){if(S.muted)return;try{let c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d)}catch(e){}}
function startGame(mode){S={score:0,round:0,brain:100,flags:0,streak:0,mode,used:{},answers:[],muted:false,ach:new Set(),textMode:false,current:null};show("game");update();load()}
function goHome(){show("home")}
function toggleMute(){S.muted=!S.muted;$("mute").textContent=S.muted?"🔇":"🔊"}
document.querySelectorAll(".modebar button").forEach(b=>b.onclick=()=>{S.mode=b.dataset.mode;S.round=0;load();document.querySelectorAll(".modebar button").forEach(x=>x.classList.toggle("active",x.dataset.mode===S.mode))});
function pool(){
 let mode=S.mode;if(mode==="mix"||mode==="chaos"){let all=[...CONTENT.quiz.map(x=>({q:x[0],tag:x[1],opts:x[2],type:"choice"})),...CONTENT.truth.map(x=>({q:x[0],tag:x[1],type:"text"})),...CONTENT.dare.map(x=>({q:x[0],tag:x[1],opts:[["I'M DOING IT 😈",15],["NOPE, SKIP",3]],type:"choice"})),...CONTENT.wyr.map(x=>({q:x[0],tag:x[1],opts:x[2],type:"choice"})),...CONTENT.confess.map(x=>({q:x[0],tag:x[1],type:"text"}))];return all}
 if(mode==="quiz")return CONTENT.quiz.map(x=>({q:x[0],tag:x[1],opts:x[2],type:"choice"}));
 if(mode==="truth")return CONTENT.truth.map(x=>({q:x[0],tag:x[1],type:"text"}));
 if(mode==="dare")return CONTENT.dare.map(x=>({q:x[0],tag:x[1],opts:[["I'M DOING IT 😈",15],["SKIP — I'M NOT STUPID",3]],type:"choice"}));
 if(mode==="wyr")return CONTENT.wyr.map(x=>({q:x[0],tag:x[1],opts:x[2],type:"choice"}));
 return CONTENT.confess.map(x=>({q:x[0],tag:x[1],type:"text"}));
}
function pick(){let p=pool(),key=S.mode;if(!S.used[key])S.used[key]=[];if(S.used[key].length>=p.length)S.used[key]=[];let av=p.map((_,i)=>i).filter(i=>!S.used[key].includes(i));let i=av[Math.floor(Math.random()*av.length)];S.used[key].push(i);return p[i]}
function load(){
 $("choices").innerHTML="";$("roast").classList.add("hidden");$("inputArea").classList.add("hidden");$("choices").style.display="grid";
 let item=(S.round>0&&S.round%8===0)?{q:CONTENT.boss[Math.floor(Math.random()*CONTENT.boss.length)],tag:"BOSS ROUND",type:"boss",opts:[["Face it 😈",19],["I'm cooked already",12]]}:pick();S.current=item;
 $("q").textContent=item.q;$("tag").textContent=item.tag;$("boss").classList.toggle("hidden",item.type!=="boss");
 $("round").textContent=`ROUND ${String(S.round+1).padStart(2,"0")}`;$("progress").style.width=`${Math.min(100,(S.round%20)/20*100)}%`;
 if(item.type==="text"){$("choices").style.display="none";$("inputArea").classList.remove("hidden");$("answerInput").value="";setTimeout(()=>$("answerInput").focus(),50)}
 else item.opts.forEach((o)=>{let b=document.createElement("button");b.textContent=o[0];b.onclick=()=>answer(o[1],item,o[0]);$("choices").appendChild(b)});
}
function submitText(){let v=$("answerInput").value.trim();if(!v){toast("Bhai kuch to confess kar 😭");return}let points=Math.min(20,8+Math.floor(v.length/30));answer(points,S.current,v)}
function answer(points,item,label){
 S.answers.push({q:item.q,label,points});S.score=Math.min(100,S.score+points*.68);S.brain=Math.max(2,100-S.score*.78);if(points>=13)S.flags++;S.streak++;
 if(S.streak>=5)S.ach.add("🔥 UNSTOPPABLE");if(S.score>=50)S.ach.add("💀 PROPERLY COOKED");if(S.flags>=5)S.ach.add("🚩 FLAG PARADE");if(S.round>=9)S.ach.add("🧠 NO BRAINCELLS");
 $("choices").style.display="none";$("inputArea").classList.add("hidden");$("roastText").textContent=makeRoast(points);$("chips").innerHTML=chips();$("roast").classList.remove("hidden");update();beep(points>15?80:210,.09);if(S.round%8===0)toast("☠️ BOSS ROUND CLEARED")}
function makeRoast(p){
 let all=p>=17?CONTENT.roasts.nuclear:p>=11?CONTENT.roasts.high:p>=7?CONTENT.roasts.mid:CONTENT.roasts.light;
 let base=all[Math.floor(Math.random()*all.length)];
 let contradiction=detect();
 if(contradiction)return contradiction;
 return base;
}
function detect(){
 let text=S.answers.map(a=>(a.label||"")+" "+a.q).join(" ").toLowerCase();
 if(text.includes("kal se")&&S.round>4)return "BSDK tere answers mein 'kal se' itni baar aa gaya hai ke kal ne khud tujhe block kar diya. 💀";
 if(S.flags>=4)return "GANDU red flags itne collect kar liye hain ke tu insaan kam, warning label zyada lag raha hai.";
 if(S.brain<30)return "MC braincells critical hain. Ab jo bhi choice karega usko hum evidence samjhenge. 😭";
 return "";
}
function chips(){let c=[];if(S.score>65)c.push("🔥 COOKED");if(S.flags>3)c.push("🚩 RED FLAG");if(S.streak>4)c.push("⚡ STREAK");if(S.brain<35)c.push("🧠 LOW IQ MODE");if(S.answers.length>7)c.push("💀 TOO FAR");return c.map(x=>`<span>${x}</span>`).join("")}
function nextRound(){S.round++;if(S.round>=22)finish();else load()}
function update(){
 let sc=Math.round(S.score);$("score").textContent=sc;$("bigScore").textContent=sc+"%";$("level").textContent=Math.floor(S.round/5)+1;$("brain").textContent=Math.round(S.brain);$("flags").textContent=S.flags;$("streak").textContent=S.streak;$("ach").textContent=`${S.ach.size}/8`;$("meter").style.width=sc+"%";$("brainbar").style.width=S.brain+"%";
}
function finish(){
 let s=Math.round(S.score);$("final").textContent=s+"%";$("verdict").textContent=s<35?"LIGHTLY TOASTED":s<60?"COOKED":s<82?"DEEP FRIED":"ABSOLUTELY FUCKING COOKED";
 let finals=s>=82?CONTENT.roasts.nuclear:s>=60?CONTENT.roasts.high:CONTENT.roasts.mid;$("finalText").textContent=finals[Math.floor(Math.random()*finals.length)];
 $("rDelulu").textContent=Math.min(99,Math.round(s*.94))+"%";$("rChaos").textContent=Math.min(99,Math.round(s*1.08))+"%";$("rFlags").textContent=Math.min(99,S.flags*8+Math.round(s*.27))+"%";$("rControl").textContent=Math.max(1,100-Math.round(s*.91))+"%";
 $("achievements").innerHTML=[...S.ach].map(x=>`<span>${x}</span>`).join("")||"<span>🏅 SURVIVED</span>";show("result");beep(70,.25)
}
async function shareResult(){
 let text=`I got ${Math.round(S.score)}% COOKED 💀\nDelulu ${$("rDelulu").textContent} • Chaos ${$("rChaos").textContent}\nRed Flags ${$("rFlags").textContent}\n\nCan you survive?`;
 try{if(navigator.share)await navigator.share({title:"I got COOKED 💀",text,url:location.href});else{await navigator.clipboard.writeText(text+" "+location.href);toast("📋 Result copied!")}}catch(e){}
}
show("home");