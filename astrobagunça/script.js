const itens = document.querySelectorAll(".draggable");
const dropzone = document.querySelector(".dropzone");

let pontos = 0;
let energia = 0;

itens.forEach(item => {
    item.addEventListener("dragstart", () => {
        item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
    });
});

dropzone.addEventListener("dragover", e => e.preventDefault());

dropzone.addEventListener("drop", () => {
    const item = document.querySelector(".dragging");
    dropzone.appendChild(item);

    pontos += 10;
    energia += 25;

    document.getElementById("pontos").innerText = pontos;
    document.getElementById("energia").innerText = energia + "%";
    document.getElementById("energia-progresso").style.width = energia + "%";

    if (energia >= 100) {
        document.getElementById("vitoria").classList.remove("hidden");
    }
});
