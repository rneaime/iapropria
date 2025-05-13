
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Obter variáveis de ambiente ou usar os valores padrão
const DB_HOST = process.env.DB_HOST || '69.62.95.133';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '$Uce$$o_@1';
const DB_NAME = process.env.DB_NAME || 'postgres';

// Configuração da conexão PostgreSQL
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar conexão com o banco
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro na conexão com o PostgreSQL:', err);
  } else {
    console.log('Conexão com PostgreSQL estabelecida com sucesso:', res.rows[0]);
  }
});

// Servir arquivos estáticos da pasta dist (onde o Vite gera a build)
app.use(express.static(path.join(__dirname, 'dist')));

// Rota API simples para teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// API para buscar usuários do banco de dados
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Todas as outras requisições GET não tratadas retornarão o React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
