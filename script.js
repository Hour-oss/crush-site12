// ===== Personalize =====
const CRUSH_NAME = "Likaaa";
const FROM_NAME  = "Hour";

// Your requested “crush-stage” message (slightly cleaned but same meaning)
const MAIN_TEXT =
  "Even tho we're somewhere more than friend and somewhere not more than friend, " +
  "we eventually don't know where we are yet. But even if Valentine's Day " +
  "is not something we should really celebrate... I still want to use this time to wish you: " +
  "great health, a good life, and a strong result in BAC. " +
  "And every other study too  Khmer or English  both will get better.";

// 3 randomized tiny wishes (exact lines you gave)
const WISHES = [
  "Hope you get all the luckkkkk you could get",
  "Your goal is waiting for you so don't ever feel like quitting",
  "I'll be here supporting you and myself aswell"
];
// =======================

/* Inject name + from line + main text */
document.getElementById("brand").textContent = `For ${CRUSH_NAME}`;
document.getElementById("fromLine").textContent = `— from ${FROM_NAME}`;
document.getElementById("subtext").textContent = MAIN_TEXT;

/* Slide navigation */
const slides = document.getElementById("slides");
const goNote = document.getElementById("goNote");
const backHome = document.getElementById("backHome");

goNote.addEventListener("click", ()=> {
  slides.scrollTo({ top: window.innerHeight, behavior: "smooth" });
});
backHome.addEventListener("click", ()=> {
  slides.scrollTo({ top: 0, behavior: "smooth" });
});

/* Tiny wish randomizer */
const wishBtn = document.getElementById("wishBtn");
const wishText = document.getElementById("wishText");

function randomWish(){
  const pick = WISHES[Math.floor(Math.random() * WISHES.length)];
  wishText.textContent = pick;
  // little “iOS pop” animation
  wishText.animate(
    [{ transform:"translateY(2px)", opacity:.7 }, { transform:"translateY(0)", opacity:1 }],
    { duration: 220, easing: "cubic-bezier(.2,.9,.2,1)" }
  );
}
wishBtn.addEventListener("click", randomWish);

/* Copy message */
document.getElementById("copyBtn").addEventListener("click", async ()=>{
  const msg = `Hey ${CRUSH_NAME} 🤍 I made a small page for you. Lowkey, but real.`;
  try{
    await navigator.clipboard.writeText(msg);
    alert("Copied ✅");
  }catch{
    alert("Copy failed — screenshot this:\n\n" + msg);
  }
});

/* Hearts on tap */
function spawnHeart(x, y){
  const el = document.createElement("div");
  el.className = "tapHeart";
  el.textContent = Math.random() > 0.35 ? "🤍" : "✨";
  el.style.left = x + "px";
  el.style.top  = y + "px";
  document.body.appendChild(el);

  const dx = (-20 + Math.random()*40);
  el.animate(
    [
      { transform:`translate(-50%,-50%) translate(0,0) scale(1)`, opacity:1 },
      { transform:`translate(-50%,-50%) translate(${dx}px, -90px) scale(1.35)`, opacity:0 }
    ],
    { duration: 900, easing: "cubic-bezier(.2,.9,.2,1)" }
  );
  setTimeout(()=> el.remove(), 920);
}

const style = document.createElement("style");
style.textContent = `
.tapHeart{
  position:fixed;
  z-index: 50;
  font-size: 18px;
  pointer-events:none;
  filter: drop-shadow(0 14px 20px rgba(20,10,30,.12));
}`;
document.head.appendChild(style);

window.addEventListener("pointerdown", (e)=>{
  if(e.target.closest("button")) return;
  spawnHeart(e.clientX, e.clientY);
});

document.getElementById("heartBtn").addEventListener("click", ()=>{
  const cx = window.innerWidth/2;
  const cy = window.innerHeight/2 + 40;
  for(let i=0;i<18;i++){
    setTimeout(()=> spawnHeart(cx + (-60+Math.random()*120), cy + (-30+Math.random()*60)), i*18);
  }
});

document.getElementById("moreHeartsBtn").addEventListener("click", ()=>{
  for(let i=0;i<26;i++){
    setTimeout(()=> spawnHeart(40 + Math.random()*(window.innerWidth-80), 140 + Math.random()*60), i*20);
  }
});

/* Music (requires user tap on phones) */
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");
let musicOn = false;

musicBtn.addEventListener("click", async ()=>{
  try{
    if(!musicOn){
      await bgm.play();
      musicOn = true;
      musicBtn.textContent = "Music On ✓";
    }else{
      bgm.pause();
      musicOn = false;
      musicBtn.textContent = "Play Music ♪";
    }
  }catch{
    alert("Music didn’t start. Make sure 'dimensions.mp3' is in the same folder as index.html.");
  }
});

/* ===== Creamy moving background (canvas) ===== */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
function resize(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const MAX = 55;
const rand = (a,b)=> a + Math.random()*(b-a);

for(let i=0;i<MAX;i++){
  particles.push({
    x: rand(0, innerWidth),
    y: rand(innerHeight, innerHeight+240),
    s: rand(10, 18),
    vy: rand(0.20, 0.65),
    vx: rand(-0.18, 0.18),
    rot: rand(0, Math.PI*2),
    vr: rand(-0.01, 0.01),
    type: Math.random() > 0.4 ? "heart" : "spark",
    a: rand(0.18, 0.42)
  });
}

function drawHeart(x,y,size,alpha,rot){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s*0.3);
  ctx.bezierCurveTo(0, -s*0.2, -s*0.8, -s*0.2, -s*0.8, s*0.3);
  ctx.bezierCurveTo(-s*0.8, s*0.8, -s*0.2, s*1.0, 0, s*1.25);
  ctx.bezierCurveTo(s*0.2, s*1.0, s*0.8, s*0.8, s*0.8, s*0.3);
  ctx.bezierCurveTo(s*0.8, -s*0.2, 0, -s*0.2, 0, s*0.3);
  ctx.closePath();

  const g = ctx.createLinearGradient(-s, -s, s, s);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,123,182,0.95)");
  ctx.fillStyle = g;
  ctx.fill();

  ctx.restore();
}

function drawSpark(x,y,size,alpha,rot){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  for(let i=0;i<10;i++){
    const r = i%2===0 ? size : size*0.42;
    const a = (Math.PI/5)*i - Math.PI/2;
    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();

  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,innerWidth,innerHeight);

  for(const p of particles){
    p.y -= p.vy;
    p.x += p.vx;
    p.rot += p.vr;

    if(p.y < -80){
      p.y = innerHeight + rand(40, 260);
      p.x = rand(0, innerWidth);
    }
    if(p.x < -60) p.x = innerWidth + 60;
    if(p.x > innerWidth + 60) p.x = -60;

    if(p.type === "heart") drawHeart(p.x, p.y, p.s, p.a, p.rot);
    else drawSpark(p.x, p.y, p.s*0.75, p.a, p.rot);
  }

  requestAnimationFrame(tick);
}
tick();