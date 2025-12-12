// starfield.js — céu preto com camadas de estrelas (parallax)
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let W = innerWidth, H = innerHeight;
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

function makeStars(n, speedBase){
  const arr = [];
  for(let i=0;i<n;i++){
    arr.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.6 + 0.3,
      speed: speedBase + Math.random()*0.6
    });
  }
  return arr;
}
const layer1 = makeStars(80, 0.25);
const layer2 = makeStars(140, 0.6);
const layer3 = makeStars(220, 1.1);

function updateLayer(layer){
  layer.forEach(s=>{
    s.y += s.speed;
    if(s.y > H + 4){ s.y = -6; s.x = Math.random()*W; }
  });
}

function drawLayer(layer, alpha){
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "white";
  layer.forEach(s => ctx.fillRect(s.x, s.y, s.r, s.r));
  ctx.globalAlpha = 1;
}

function loop(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,W,H);
  updateLayer(layer1); updateLayer(layer2); updateLayer(layer3);
  drawLayer(layer1, 0.28); drawLayer(layer2, 0.55); drawLayer(layer3, 0.95);
  requestAnimationFrame(loop);
}
loop();

