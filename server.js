const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // <- AUMENTADO PRA CABER FOTO
app.use(express.static(path.join(__dirname, 'public')));

let chamados = []; // memória temporária
let idAtual = 1;

app.get('/', (req,res)=> res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/usuarios', async (req,res)=> res.json([]));

// LISTAR - aceita os 2 caminhos pra não dar erro
app.get('/chamados', (req,res)=> res.json(chamados));
app.get('/api/tickets', (req,res)=> res.json(chamados));

// CRIAR - com imagem
app.post('/chamados', (req,res)=>{
  const { titulo, descricao, image } = req.body;
  const novo = { 
    id: idAtual++, 
    titulo, 
    descricao, 
    title: titulo,
    description: descricao,
    image: image || null, // <- SALVA A FOTO
    data: new Date().toLocaleString('pt-BR'),
    created_at: new Date()
  };
  chamados.push(novo);
  try { 
    const pool = require('./db');
    pool.query('INSERT INTO chamados (titulo, descricao, image) VALUES (?,?,?)', [titulo, descricao, image]).catch(()=>{});
  } catch(e){}
  res.status(201).json(novo);
});

app.post('/api/tickets', (req,res)=>{
  const { titulo, descricao, title, description, image } = req.body;
  const finalTitulo = titulo || title;
  const finalDesc = descricao || description;
  const novo = { 
    id: idAtual++, 
    titulo: finalTitulo, 
    descricao: finalDesc,
    title: finalTitulo,
    description: finalDesc,
    image: image || null,
    data: new Date().toLocaleString('pt-BR'),
    created_at: new Date()
  };
  chamados.push(novo);
  res.status(201).json(novo);
});

// DELETAR
app.delete('/chamados/:id', (req,res)=>{
  chamados = chamados.filter(c => c.id != req.params.id);
  try { 
    const pool = require('./db');
    pool.query('DELETE FROM chamados WHERE id =?', [req.params.id]).catch(()=>{});
  } catch(e){}
  res.json({ok:true});
});
app.delete('/api/tickets/:id', (req,res)=>{
  chamados = chamados.filter(c => c.id != req.params.id);
  res.json({ok:true});
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('Rodando na porta 3000'));
}
module.exports = app;