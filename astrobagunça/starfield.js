const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = [];

  for(let i=0; i<200; i++){
    stars.push({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*3+1
    });
  }
}
resize();
window.onresize = resize;

function animate(){
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = "#fff";

  stars.forEach(s=>{
    ctx.fillRect(s.x,s.y,s.z,s.z);

    s.y += s.z * 0.8;

    if(s.y > h){
      s.x = Math.random()*w;
      s.y = -10;
    }
  });

  requestAnimationFrame(animate);
}
animate();
