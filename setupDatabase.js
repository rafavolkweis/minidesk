const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  await conn.query(`USE ${process.env.DB_NAME}`);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS chamados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT,
      status VARCHAR(50) DEFAULT 'Pendente'
    )
  `);
  console.log('Banco e tabela criados!');
  await conn.end();
}
setup();