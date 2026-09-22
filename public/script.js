let imagemBase64 = null;
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const dropZone = document.getElementById('dropZone');

function mostrarPreview(base64){
  imagemBase64 = base64;
  preview.innerHTML = `<div class="preview-wrap"><img src="${base64}"><button class="x-remove" onclick="removerImagem()" title="Remover">✕</button></div>`;
}
function removerImagem(){ imagemBase64=null; fileInput.value=''; preview.innerHTML=''; }

fileInput?.addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(file);
});
document.addEventListener('paste', (e)=>{
  const item=[...(e.clipboardData?.items||[])].find(i=>i.type.includes('image'));
  if(item){ const f=item.getAsFile(); const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(f); }
});
dropZone?.addEventListener('dragover', (e)=>{ e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone?.addEventListener('dragleave', ()=> dropZone.classList.remove('dragover'));
dropZone?.addEventListener('drop', (e)=>{
  e.preventDefault(); dropZone.classList.remove('dragover');
  const file=e.dataTransfer.files[0];
  if(file && file.type.includes('image')){ const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(file); }
});

async function criar(){
  const titulo=document.getElementById('titulo').value.trim();
  const descricao=document.getElementById('descricao').value.trim();
  if(!titulo || !descricao){ alert('Preencha título e descrição!'); return; }
  const payload={titulo, descricao, image: imagemBase64};
  await fetch('/api/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  await fetch('/chamados',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  document.getElementById('titulo').value=''; document.getElementById('descricao').value=''; removerImagem(); carregar();
}

async function deletar(id){
  if(!confirm('Marcar como resolvido e remover este chamado?')) return;
  await fetch(`/chamados/${id}`, {method:'DELETE'}).catch(()=>{});
  await fetch(`/api/tickets/${id}`, {method:'DELETE'}).catch(()=>{});
  carregar();
}

async function carregar(){
  try{
    let res=await fetch('/chamados'); if(!res.ok) res=await fetch('/api/tickets');
    const tickets=await res.json();
    document.getElementById('count').innerText=tickets.length;
    document.getElementById('lista').innerHTML=tickets.map(t=>`
      <div class="ticket-item">
        <div class="ticket-header">
          <span class="ticket-title">${(t.titulo||t.title||'').replace(/</g,'&lt;')}</span>
          <div style="display:flex; gap:6px; align-items:center">
            <span class="ticket-id">#${t.id}</span>
            <button class="x-ticket" onclick="deletar(${t.id})" title="Resolver / Remover">✕</button>
          </div>
        </div>
        <p class="ticket-desc">${(t.descricao||t.description||'').replace(/</g,'&lt;')}</p>
        ${t.image ? `<img src="${t.image}" class="ticket-img" onclick="window.open(this.src)">` : ''}
        <div class="ticket-footer">🕒 ${new Date(t.created_at||t.data||Date.now()).toLocaleString('pt-BR')}</div>
      </div>`).join('') || '<p class="empty">Nenhum chamado ainda. Crie o primeiro! 👆</p>';
  }catch(e){ document.getElementById('lista').innerHTML='<p class="empty">Erro ao carregar</p>'; }
}
carregar();