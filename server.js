const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let chamados = []; // memória temporária
let idAtual = 1;

app.get('/', (req,res)=>res.json({status:'ok'}));
app.get('/usuarios', async (req,res)=>res.json([]));

app.get('/chamados', (req,res)=>{
  res.json(chamados);
});

app.post('/chamados', (req,res)=>{
  const { titulo, descricao } = req.body;
  const novo = { id: idAtual++, titulo, descricao, data: new Date().toLocaleString('pt-BR') };
  chamados.push(novo);
  // tenta salvar no banco também se tiver
  try { 
    const pool = require('./db');
    pool.query('INSERT INTO chamados (titulo, descricao) VALUES (?,?)', [titulo, descricao]).catch(()=>{});
  } catch(e){}
  res.status(201).json(novo);
});

app.delete('/chamados/:id', (req,res)=>{
  chamados = chamados.filter(c => c.id != req.params.id);
  try { 
    const pool = require('./db');
    pool.query('DELETE FROM chamados WHERE id =?', [req.params.id]).catch(()=>{});
  } catch(e){}
  res.json({ok:true});
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('Rodando na porta 3000'));
}
module.exports = app;