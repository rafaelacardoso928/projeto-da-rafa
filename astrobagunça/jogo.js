const tray = document.getElementById("tray");
const stage = document.getElementById("stage");
const imgNave = document.getElementById("imgNave");

const pontosEl = document.getElementById("pontos");
const energiaEl = document.getElementById("energia");
const faseEl = document.getElementById("faseAtual");

const popup = document.getElementById("popup");
const nextFaseBtn = document.getElementById("nextFase");

let fase = 1;
let pontos = 0;
let energia = 0;
let itensRestantes = 0;

/* ---- OBJETOS DAS FASES ---- */
const fases = {
  1:{
    nave:"NAVE_FASE_1.png",
    itens:[
      {img:"OBJ1.png"},
      {img:"OBJ2.png"},
      {img:"OBJ3.png"},
    ]
  },
  2:{
    nave:"NAVE_FASE_2.png",
    itens:[
      {img:"OBJ4.png"},
      {img:"OBJ5.png"},
      {img:"OBJ6.png"},
    ]
  },
  3:{
    nave:"NAVE_FASE_3.png",
    itens:[
      {img:"OBJ7.png"},
      {img:"OBJ8.png"},
      {img:"OBJ9.png"},
    ]
  }
};

/* ---- INICIAR FASE ---- */
function carregarFase(){
  const f = fases[fase];

  faseEl.textContent = fase;
  imgNave.src = f.nave;

  tray.innerHTML = "";
  stage.innerHTML = `<img class="img-nave" id="imgNave" src="${f.nave}">`;

  itensRestantes = f.itens.length;

  f.itens.forEach((it,i)=>{
    const el = document.createElement("img");
    el.src = it.img;
    el.classList.add("item");
    el.draggable = true;
    el.id = "item"+i;

    el.addEventListener("dragstart", evt=>{
      evt.dataTransfer.setData("id", el.id);
    });

    tray.appendChild(el);

    // criar local correto
    const alvo = document.createElement("div");
    alvo.classList.add("alvo");
    alvo.style.position = "absolute";
    alvo.style.left = (50 + i*120) + "px";
    alvo.style.top = "260px";
    alvo.style.width = "100px";
    alvo.style.height = "100px";
    alvo.style.border = "2px dashed white";

    alvo.addEventListener("dragover", evt=>evt.preventDefault());
    alvo.addEventListener("drop", evt=>{
      const id = evt.dataTransfer.getData("id");
      const item = document.getElementById(id);

      alvo.appendChild(item);
      item.style.position = "static";
      item.draggable = false;

      itensRestantes--;
      pontos += 10;
      energia += 30;

      pontosEl.textContent = pontos;
      energiaEl.textContent = energia + "%";

      if(itensRestantes === 0){ concluirFase(); }
    });

    stage.appendChild(alvo);
  });
}

carregarFase();

/* ---- FASE COMPLETA ---- */
function concluirFase(){
  popup.style.display = "block";

  if(fase === 3){
    document.getElementById("popup-title").textContent = "Parabéns!";
    document.getElementById("popup-msg").textContent =
      "Você completou as 3 fases e a nave decolou! 🚀";
    nextFaseBtn.textContent = "Voltar ao início";
  }
}

/* ---- BOTÃO PRÓXIMA FASE ---- */
nextFaseBtn.addEventListener("click", ()=>{
  popup.style.display = "none";

  if(fase < 3){
    fase++;
    energia = 0;
    carregarFase();
  } else {
    window.location.href = "index.html";
  }
});
