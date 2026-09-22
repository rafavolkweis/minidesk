let imagemBase64 = null;
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const dropZone = document.getElementById('dropZone');

function mostrarPreview(b64){
  imagemBase64=b64;
  preview.innerHTML=`<div class="preview-wrap"><img src="${b64}"><button class="x-remove" onclick="removerImagem()">✕</button></div>`;
}
function removerImagem(){imagemBase64=null;fileInput.value='';preview.innerHTML='';}

fileInput?.addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=ev=>mostrarPreview(ev.target.result); r.readAsDataURL(f);
});

async function criar(){
  const t=document.getElementById('titulo').value.trim();
  const d=document.getElementById('descricao').value.trim();
  if(!t||!d){alert('Preencha título e descrição');return;}
  await fetch('/chamados',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo:t,descricao:d,image:imagemBase64})});
  document.getElementById('titulo').value=''; document.getElementById('descricao').value=''; removerImagem(); carregar();
}
async function deletar(id){
  if(!confirm('Resolver e remover chamado #'+id+'?')) return;
  await fetch('/chamados/'+id,{method:'DELETE'}); carregar();
}
async function carregar(){
  try{
    const r=await fetch('/chamados'); const tickets=await r.json();
    document.getElementById('count').innerText=tickets.length;
    document.getElementById('lista').innerHTML=tickets.map(x=>`
      <div class="ticket-item">
        <div class="ticket-header">
          <span class="ticket-title">${(x.titulo||'').replace(/</g,'&lt;')}</span>
          <div style="display:flex;gap:6px;align-items:center"><span class="ticket-id">#${x.id}</span><button class="x-ticket" onclick="deletar(${x.id})">✕</button></div>
        </div>
        <p class="ticket-desc">${(x.descricao||'').replace(/</g,'&lt;')}</p>
        ${x.image?`<img src="${x.image}" class="ticket-img" onclick="window.open(this.src)">`:''}
        <div class="ticket-footer">${new Date(x.created_at).toLocaleString('pt-BR')}</div>
      </div>`).join('') || '<p class="empty">Nenhum chamado</p>';
  }catch(e){ document.getElementById('lista').innerHTML='<p class="empty">Erro ao carregar</p>'; }
}
carregar();