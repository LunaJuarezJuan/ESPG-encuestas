const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 4000;

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'mysql', // nombre del servicio en docker-compose
  user: 'admin',
  password: '123456',
  database: 'encuestas_postgrado'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
