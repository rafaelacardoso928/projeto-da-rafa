/* --------------------------
   FUNDO DE ESTRELAS ANIMADAS
----------------------------*/
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let numStars = 300;

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();

function spawnStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 1 + 0.4,
      size: Math.random() * 2 + 0.6
    });
  }
}
spawnStars();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;

    if (star.y > canvas.height) {
      star.y = -2;
      star.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animate);
}
animate();


/* --------------------------
        JOGO
----------------------------*/

// ITENS DISPONÍVEIS
const itemData = [
  { id: "helmet", label: "Capacete" },
  { id: "wrench", label: "Chave Inglesa" },
  { id: "book", label: "Manual" },
  { id: "cup", label: "Copo Espacial" },
  { id: "tool", label: "Ferramenta" }
];

const itemsContainer = document.getElementById("items");
const placedCounter = document.getElementById("placed");

let placed = 0;

// CRIA OS ITENS NO INVENTÁRIO
itemData.forEach(obj => {
  const div = document.createElement("div");
  div.classList.add("item");
  div.textContent = obj.label;
  div.draggable = true;
  div.dataset.type = obj.id;

  div.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", div.dataset.type);
  });

  itemsContainer.appendChild(div);
});

// DROPZONES
const zones = document.querySelectorAll(".dropzone");

zones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", e => {
    const item = e.dataTransfer.getData("text");

    if (item === zone.dataset.accept) {
      zone.classList.add("good");

      placed++;
      placedCounter.textContent = placed;

      if (placed === 5) win();
    }
  });
});


/* --------------------------
        TIMER
----------------------------*/
let time = 60;
let timer;
const timeText = document.getElementById("time");
const timerProgress = document.getElementById("timer-progress");

function startTimer() {
  if (timer) return; // evita iniciar 2 vezes

  timer = setInterval(() => {
    time--;
    timeText.textContent = time;

    timerProgress.style.strokeDashoffset = 280 - (time / 60) * 280;

    if (time <= 0) {
      lose();
    }

  }, 1000);
}


/* --------------------------
  BOTÕES: INICIAR / RECOMEÇAR
----------------------------*/
document.getElementById("start").onclick = () => {
  startTimer();
};

document.getElementById("reset").onclick = () => {
  location.reload();
};


/* --------------------------
         RESULTADOS
----------------------------*/
function win() {
  clearInterval(timer);
  document.getElementById("msg").textContent =
    "✨ Parabéns! A nave está pronta para decolar! 🚀";
}

function lose() {
  clearInterval(timer);
  document.getElementById("msg").textContent =
    "⛔ Tempo esgotado! A missão falhou!";
}
