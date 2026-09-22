const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.static(path.join(__dirname, 'public')));
let tickets = []; let idCounter = 1;

app.get('/chamados', (req,res)=> res.json(tickets));
app.get('/api/tickets', (req,res)=> res.json(tickets));

app.post('/chamados', (req,res)=>{
  const {titulo, title, descricao, description, image} = req.body;
  const t={id:idCounter++, titulo: titulo||title, descricao: descricao||description, image: image||null, created_at:new Date().toISOString()};
  tickets.unshift(t); res.json(t);
});
app.post('/api/tickets', (req,res)=>{
  const {titulo, title, descricao, description, image} = req.body;
  const t={id:idCounter++, titulo: titulo||title, descricao: descricao||description, image: image||null, created_at:new Date().toISOString()};
  tickets.unshift(t); res.json(t);
});

// NOVO: DELETAR CHAMADO RESOLVIDO
app.delete('/chamados/:id', (req,res)=>{
  tickets = tickets.filter(t=> t.id != req.params.id);
  res.json({ok:true});
});
app.delete('/api/tickets/:id', (req,res)=>{
  tickets = tickets.filter(t=> t.id != req.params.id);
  res.json({ok:true});
});

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));
const PORT=process.env.PORT||3000;
app.listen(PORT, ()=> console.log('Rodando na porta '+PORT));
module.exports=app;