let imagemBase64 = null;
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

function mostrarPreview(base64){
  imagemBase64 = base64;
  preview.innerHTML = `<img src="${base64}"><button class="btn-remove" onclick="removerImagem()">❌ Remover imagem</button>`;
}
function removerImagem(){ imagemBase64=null; fileInput.value=''; preview.innerHTML=''; }

fileInput?.addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  if(file.size > 2*1024*1024){ alert('Max 2MB'); return; }
  const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(file);
});
document.addEventListener('paste', (e)=>{
  const item=[...(e.clipboardData?.items||[])].find(i=>i.type.includes('image'));
  if(item){ const f=item.getAsFile(); const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(f); }
});
document.addEventListener('dragover', e=>e.preventDefault());
document.addEventListener('drop', e=>{
  e.preventDefault();
  const file=e.dataTransfer.files[0];
  if(file && file.type.includes('image')){ const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(file); }
});

async function criar(){
  const titulo=document.getElementById('titulo').value.trim();
  const descricao=document.getElementById('descricao').value.trim();
  if(!titulo || !descricao){ alert('Preencha titulo e descricao!'); return; }
  await fetch('/api/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo, descricao, image: imagemBase64})});
  await fetch('/chamados',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo, descricao, image: imagemBase64})}).catch(()=>{});
  document.getElementById('titulo').value=''; document.getElementById('descricao').value=''; removerImagem(); carregar();
}

async function carregar(){
  const res=await fetch('/chamados').catch(()=>fetch('/api/tickets'));
  const tickets=await res.json();
  document.getElementById('count').innerText=tickets.length;
  document.getElementById('lista').innerHTML=tickets.map(t=>`
    <div class="ticket-item">
      <div class="ticket-header">
        <span class="ticket-title">${t.titulo || t.title}</span>
        <span class="ticket-id">#${t.id}</span>
      </div>
      <p class="ticket-desc">${t.descricao || t.description}</p>
      ${t.image ? `<img src="${t.image}" class="ticket-img" onclick="window.open(this.src)">` : ''}
      <div class="ticket-footer">Criado em ${new Date(t.created_at || t.data || Date.now()).toLocaleString('pt-BR')}</div>
    </div>
  `).join('') || '<p class="empty">Nenhum chamado ainda</p>';
}
carregar();