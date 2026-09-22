const API = '/chamados';
async function carregar(){
  const res = await fetch(API); const data = await res.json();
  document.getElementById('count').innerText = data.length;
  const lista = document.getElementById('lista');
  if(!data.length){lista.innerHTML='<p style="opacity:.5;margin-top:10px">Nenhum chamado 🎉</p>';return}
  lista.innerHTML = data.reverse().map(c=>`
    <div class="ticket">
      <div><b>${c.titulo}</b><small>${c.descricao||''}</small></div>
      <button class="del" onclick="fechar(${c.id})">X</button>
    </div>`).join('');
}
async function criar(){
  const titulo=document.getElementById('titulo').value;
  const descricao=document.getElementById('descricao').value;
  if(!titulo)return alert('Coloca um título!');
  await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo,descricao})});
  document.getElementById('titulo').value='';document.getElementById('descricao').value='';
  carregar();
}
async function fechar(id){await fetch(`${API}/${id}`,{method:'DELETE'});carregar();}
carregar();