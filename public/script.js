let imagemBase64 = null;
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

function mostrarPreview(base64){
  imagemBase64 = base64;
  preview.innerHTML = `<img src="${base64}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid #333"><br><button onclick="removerImagem()" style="margin-top:6px; font-size:12px">❌ Remover</button>`;
}
function removerImagem(){
  imagemBase64 = null; fileInput.value=''; preview.innerHTML='';
}
fileInput?.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  if(file.size > 2*1024*1024){ alert('Max 2MB!'); return; }
  const r = new FileReader(); r.onload = ev => mostrarPreview(ev.target.result); r.readAsDataURL(file);
});
document.addEventListener('paste', (e)=>{
  const item = [...(e.clipboardData?.items||[])].find(i=> i.type.includes('image'));
  if(item){ const f=item.getAsFile(); const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(f); }
});

async function criar(){
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  if(!titulo || !descricao){ alert('Preencha titulo e descricao!'); return; }
  await fetch('/api/tickets', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ titulo, descricao, image: imagemBase64 })
  });
  document.getElementById('titulo').value=''; document.getElementById('descricao').value='';
  removerImagem(); carregar();
}
async function carregar(){
  const res = await fetch('/api/tickets'); const tickets = await res.json();
  document.getElementById('count').innerText = tickets.length;
  document.getElementById('lista').innerHTML = tickets.map(t=>`
    <div class="ticket" style="border-bottom:1px solid #222; padding:10px 0">
      <strong>${t.titulo || t.title}</strong><p>${t.descricao || t.description}</p>
      ${t.image ? `<img src="${t.image}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid #333" onclick="window.open(this.src)">` : ''}
      <small style="color:#666">#${t.id} - ${new Date(t.created_at).toLocaleString('pt-BR')}</small>
    </div>
  `).join('') || '<p style="color:#666">Nenhum chamado ainda</p>';
}
carregar();