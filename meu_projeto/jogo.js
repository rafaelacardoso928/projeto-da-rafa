// jogo.js — drag & drop (mouse + touch), checklist, sons, decolagem final
(() => {
  const PHASES = [
    { id:1, nave:"IMAGENS/NAVE_FASE_1.png", itens:[
      {id:"f1-0", src:"IMAGENS/OBJ1.png", label:"Livro"},
      {id:"f1-1", src:"IMAGENS/OBJ2.png", label:"Garrafa"},
      {id:"f1-2", src:"IMAGENS/OBJ3.png", label:"Caneta"}
    ]},
    { id:2, nave:"IMAGENS/NAVE_FASE_2.png", itens:[
      {id:"f2-0", src:"IMAGENS/OBJ4.png", label:"Boneco"},
      {id:"f2-1", src:"IMAGENS/OBJ5.png", label:"Meias"},
      {id:"f2-2", src:"IMAGENS/OBJ6.png", label:"Chapéu"}
    ]},
    { id:3, nave:"IMAGENS/NAVE_FASE_3.png", itens:[
      {id:"f3-0", src:"IMAGENS/OBJ7.png", label:"Óculos"},
      {id:"f3-1", src:"IMAGENS/OBJ8.png", label:"Relógio"},
      {id:"f3-2", src:"IMAGENS/OBJ9.png", label:"Lanterna"}
    ]}
  ];

  // DOM
  const stage = document.getElementById("stage");
  const tray = document.getElementById("tray");
  const checklist = document.getElementById("checklist");
  const popup = document.getElementById("popup");
  const nextFaseBtn = document.getElementById("nextFase");
  const btnStart = document.getElementById("btn-start");
  const pontosEl = document.getElementById("pontos");
  const energiaEl = document.getElementById("energia");
  const faseEl = document.getElementById("faseAtual");
  const bgMusic = document.getElementById("bgMusic");
  const soundWin = document.getElementById("soundWin");
  const soundLaunch = document.getElementById("soundLaunch");

  let current = 0;
  let placedCount = 0;
  let totalItens = 0;
  let startedAudio = false;
  let pontos = 0;

  // audio start (user gesture)
  function enableAudio(){
    if(startedAudio) return;
    startedAudio = true;
    try{ bgMusic.volume = 0.2; bgMusic.play().catch(()=>{}); } catch(e){}
    if(btnStart){ btnStart.textContent = "Música ligada"; btnStart.disabled = true; }
  }
  if(btnStart) btnStart.addEventListener('click', enableAudio);
  document.addEventListener('pointerdown', enableAudio, { once:true });

  function renderChecklist(phase){
    if(!checklist) return;
    checklist.innerHTML = "";
    phase.itens.forEach(it=>{
      const li = document.createElement('li');
      li.id = 'chk-'+it.id;
      li.innerHTML = `<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" disabled> ${it.label}</label>`;
      checklist.appendChild(li);
    });
  }

  // universal pointer drag fallback + mouse drag support
  let pointerDrag = null;

  function pointerStart(e){
    const el = e.currentTarget;
    enableAudio();
    pointerDrag = el;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    el._offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    el.style.position = 'absolute';
    el.style.left = (e.clientX - el._offset.x) + 'px';
    el.style.top = (e.clientY - el._offset.y) + 'px';
    el.style.zIndex = 9999;
    document.body.appendChild(el);

    function move(ev){ if(!pointerDrag) return; pointerDrag.style.left = (ev.clientX - pointerDrag._offset.x) + 'px'; pointerDrag.style.top = (ev.clientY - pointerDrag._offset.y) + 'px'; }
    function up(ev){
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
      const dz = dropEl && dropEl.closest('.dropzone');
      if(dz) handleDropPointer(pointerDrag, dz);
      else { // return to tray
        pointerDrag.style.position = ''; pointerDrag.style.left=''; pointerDrag.style.top=''; pointerDrag.style.zIndex=''; tray.appendChild(pointerDrag);
      }
      pointerDrag = null;
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // mouse drag events using dataTransfer
  document.addEventListener('dragstart', e=>{
    const it = e.target.closest('.item');
    if(!it) return;
    e.dataTransfer.setData('text/plain', it.dataset.id);
    setTimeout(()=> it.classList.add('hidden'), 10);
  });
  document.addEventListener('dragend', e=>{
    const it = e.target.closest('.item');
    if(it) it.classList.remove('hidden');
  });

  document.addEventListener('drop', e=>{
    const dz = e.target.closest('.dropzone');
    if(!dz) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = document.querySelector(`.item[data-id="${id}"]`);
    if(item) handleDropPointer(item, dz);
  });
  document.addEventListener('dragover', e=>{
    if(e.target.closest('.dropzone')) e.preventDefault();
  });

  function handleDropPointer(itemEl, dz){
    const accept = dz.dataset.accept;
    const id = itemEl.dataset.id;
    if(id === accept && dz.children.length === 0){
      const img = document.createElement('img');
      img.src = itemEl.querySelector('img').src;
      img.style.width = '86%';
      img.style.height = '86%';
      img.style.objectFit = 'contain';
      dz.appendChild(img);
      dz.classList.add('filled');
      itemEl.remove();

      const chk = document.getElementById('chk-'+id);
      if(chk) chk.querySelector('input').checked = true;

      placedCount++;
      pontos += 10;
      updateHUD();

      try{ soundWin.currentTime = 0; soundWin.play(); }catch(e){}

      if(placedCount >= totalItens){
        popup.style.display = 'block';
        if(current === PHASES.length -1){
          document.getElementById('popup-title').textContent = 'Você finalizou todas as fases! ✨';
          document.getElementById('popup-text').textContent = 'Preparando decolagem final...';
          setTimeout(()=> rocketLaunchSequence(), 900);
        }
      }
    } else {
      dz.animate([{ transform:'translateY(0)' },{ transform:'translateY(-8px)' },{ transform:'translateY(0)' }], { duration:260 });
      // restore if necessary
      try { itemEl.style.position=''; itemEl.style.left=''; itemEl.style.top=''; tray.appendChild(itemEl); } catch(e){}
    }
  }

  function updateHUD(){
    pontosEl && (pontosEl.textContent = pontos);
    energiaEl && (energiaEl.textContent = totalItens ? Math.round((placedCount/totalItens)*100) + '%' : '0%');
    faseEl && (faseEl.textContent = current + 1);
  }

  // load phase
  function loadPhase(index){
    current = index;
    placedCount = 0;
    pontos = 0;
    stage.innerHTML = '';
    tray.innerHTML = '';
    popup.style.display = 'none';

    const phase = PHASES[index];
    faseEl.textContent = index + 1;

    // nave
    const n = document.createElement('img');
    n.className = 'img-nave';
    n.src = phase.nave;
    stage.appendChild(n);

    // create dropzones
    phase.itens.forEach((it,i)=>{
      const dz = document.createElement('div');
      dz.className = 'dropzone';
      dz.dataset.accept = it.id;
      dz.style.left = (18 + i*30) + '%';
      dz.style.top = '36%';
      dz.addEventListener('dragover', e=> e.preventDefault());
      stage.appendChild(dz);
    });

    totalItens = phase.itens.length;
    renderChecklist(phase);

    // create tray items shuffled
    const shuffled = phase.itens.slice().sort(()=>Math.random()-0.5);
    shuffled.forEach(it=>{
      const card = document.createElement('div');
      card.className = 'item';
      card.draggable = true;
      card.dataset.id = it.id;
      const im = document.createElement('img');
      im.src = it.src;
      im.alt = it.label;
      card.appendChild(im);
      card.addEventListener('pointerdown', pointerStart);
      tray.appendChild(card);
    });

    updateHUD();
  }

  function renderChecklist(phase){
    if(!checklist) return;
    checklist.innerHTML = '';
    phase.itens.forEach(it=>{
      const li = document.createElement('li');
      li.id = 'chk-'+it.id;
      li.innerHTML = `<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" disabled> ${it.label}</label>`;
      checklist.appendChild(li);
    });
  }

  // next phase button
  nextFaseBtn && nextFaseBtn.addEventListener('click', ()=>{
    popup.style.display = 'none';
    if(current < PHASES.length -1) loadPhase(current+1);
    else loadPhase(0);
  });

  // rocket
  function rocketLaunchSequence(){
    try{ bgMusic.pause(); soundLaunch.currentTime = 0; soundLaunch.play(); }catch(e){}
    const rocket = document.createElement('div');
    rocket.className = 'launch-rocket';
    rocket.innerHTML = '🚀';
    document.body.appendChild(rocket);
    rocket.animate([
      { transform:'translateX(-50%) translateY(0) scale(1)', opacity:1 },
      { transform:'translateX(-50%) translateY(-120vh) scale(1.2)', opacity:0.95 }
    ], { duration:3200, easing:'cubic-bezier(.2,.9,.2,1)' }).onfinish = ()=>{
      rocket.remove();
      document.getElementById('popup-title').textContent = 'Parabéns, piloto!';
      document.getElementById('popup-text').textContent = 'A nave decolou graças a você! ✨';
      popup.style.display = 'block';
    };
  }

  // init
  loadPhase(0);
  window._loadPhase = loadPhase;

})();
