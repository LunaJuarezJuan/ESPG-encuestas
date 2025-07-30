const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexiones a MySQL
const db = mysql.createPool({
  host: 'mysql',
  user: 'admin',
  password: '123456',
  database: 'encuestas_postgrado',
  charset: 'utf8mb4',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Verificar conexión
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
  connection.release();
});

// ===== CICLOS =====
app.get('/api/ciclos', (req, res) => {
  db.query('SELECT * FROM ciclos ORDER BY nombre', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/ciclos', (req, res) => {
  const { nombre } = req.body;
  db.query('INSERT INTO ciclos (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, nombre });
  });
});

// ===== SECCIONES =====
app.get('/api/secciones', (req, res) => {
  const { ciclo_id } = req.query;
  let query = 'SELECT s.*, c.nombre as ciclo_nombre FROM secciones s JOIN ciclos c ON s.ciclo_id = c.id';
  let params = [];
  
  if (ciclo_id) {
    query += ' WHERE s.ciclo_id = ?';
    params.push(ciclo_id);
  }
  
  query += ' ORDER BY c.nombre, s.nombre';
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/secciones', (req, res) => {
  const { nombre, ciclo_id } = req.body;
  db.query('INSERT INTO secciones (nombre, ciclo_id) VALUES (?, ?)', [nombre, ciclo_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, nombre, ciclo_id });
  });
});

// ===== DOCENTES =====
app.get('/api/docentes', (req, res) => {
  db.query('SELECT * FROM docentes ORDER BY nombre', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/docentes', (req, res) => {
  const { nombre, celular } = req.body;
  db.query('INSERT INTO docentes (nombre, celular) VALUES (?, ?)', [nombre, celular], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, nombre, celular });
  });
});

// ===== CURSOS =====
app.get('/api/cursos', (req, res) => {
  const query = `
    SELECT c.*, d.nombre as docente_nombre, s.nombre as seccion_nombre, 
           cic.nombre as ciclo_nombre
    FROM cursos c 
    JOIN docentes d ON c.docente_id = d.id 
    JOIN secciones s ON c.seccion_id = s.id
    JOIN ciclos cic ON s.ciclo_id = cic.id
    ORDER BY cic.nombre, s.nombre, c.nombre
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/cursos', (req, res) => {
  const { nombre, docente_id, seccion_id } = req.body;
  db.query('INSERT INTO cursos (nombre, docente_id, seccion_id) VALUES (?, ?, ?)', 
    [nombre, docente_id, seccion_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, nombre, docente_id, seccion_id });
  });
});

// ===== ESTUDIANTES =====
app.get('/api/estudiantes', (req, res) => {
  const { curso_id } = req.query;
  let query = `
    SELECT e.*, c.nombre as curso_nombre, d.nombre as docente_nombre, 
           s.nombre as seccion_nombre, cic.nombre as ciclo_nombre
    FROM estudiantes e 
    JOIN cursos c ON e.curso_id = c.id
    JOIN docentes d ON c.docente_id = d.id
    JOIN secciones s ON c.seccion_id = s.id
    JOIN ciclos cic ON s.ciclo_id = cic.id
  `;
  let params = [];
  
  if (curso_id) {
    query += ' WHERE e.curso_id = ?';
    params.push(curso_id);
  }
  
  query += ' ORDER BY e.nombre';
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/estudiantes', (req, res) => {
  const { nombre, celular, curso_id } = req.body;
  db.query('INSERT INTO estudiantes (nombre, celular, curso_id) VALUES (?, ?, ?)', 
    [nombre, celular, curso_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, nombre, celular, curso_id });
  });
});

// ===== ENCUESTAS =====
app.get('/api/encuestas', (req, res) => {
  const query = `
    SELECT e.*, c.nombre as curso_nombre, d.nombre as docente_nombre, 
           s.nombre as seccion_nombre, cic.nombre as ciclo_nombre
    FROM encuestas e 
    JOIN cursos c ON e.curso_id = c.id
    JOIN docentes d ON c.docente_id = d.id
    JOIN secciones s ON c.seccion_id = s.id
    JOIN ciclos cic ON s.ciclo_id = cic.id
    ORDER BY e.fecha_creacion DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/encuestas', (req, res) => {
  const { titulo, curso_id } = req.body;
  db.query('INSERT INTO encuestas (titulo, curso_id) VALUES (?, ?)', 
    [titulo, curso_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, titulo, curso_id });
  });
});

// ===== PREGUNTAS =====
app.get('/api/preguntas/:encuesta_id', (req, res) => {
  const { encuesta_id } = req.params;
  db.query('SELECT * FROM preguntas WHERE encuesta_id = ? ORDER BY orden', 
    [encuesta_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/preguntas', (req, res) => {
  const { encuesta_id, texto, orden } = req.body;
  db.query('INSERT INTO preguntas (encuesta_id, texto, orden) VALUES (?, ?, ?)', 
    [encuesta_id, texto, orden], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, encuesta_id, texto, orden });
  });
});

// ===== RESPUESTAS =====
app.get('/api/respuestas/:encuesta_id', (req, res) => {
  const { encuesta_id } = req.params;
  const query = `
    SELECT r.*, e.nombre as estudiante_nombre, p.texto as pregunta_texto
    FROM respuestas r
    JOIN estudiantes e ON r.estudiante_id = e.id
    JOIN preguntas p ON r.pregunta_id = p.id
    WHERE p.encuesta_id = ?
    ORDER BY e.nombre, p.orden
  `;
  
  db.query(query, [encuesta_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/respuestas', (req, res) => {
  const { estudiante_id, pregunta_id, respuesta_texto } = req.body;
  db.query('INSERT INTO respuestas (estudiante_id, pregunta_id, respuesta_texto) VALUES (?, ?, ?)', 
    [estudiante_id, pregunta_id, respuesta_texto], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, estudiante_id, pregunta_id, respuesta_texto });
  });
});

// ===== ENVÍO DE ENCUESTAS POR WHATSAPP =====
app.post('/api/enviar-encuesta', async (req, res) => {
  const { encuesta_id, fecha_envio } = req.body;
  
  try {
    // Obtener la encuesta con preguntas
    const [encuesta] = await db.promise().query(
      'SELECT * FROM encuestas WHERE id = ?', [encuesta_id]
    );
    
    if (encuesta.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    
    // Obtener preguntas de la encuesta
    const [preguntas] = await db.promise().query(
      'SELECT * FROM preguntas WHERE encuesta_id = ? ORDER BY orden', [encuesta_id]
    );
    
    // Obtener estudiantes del curso
    const [estudiantes] = await db.promise().query(
      'SELECT * FROM estudiantes WHERE curso_id = ?', [encuesta[0].curso_id]
    );
    
    // Aquí se programaría el envío por WhatsApp
    // Por ahora solo guardamos la información
    const programacion = {
      encuesta_id,
      fecha_envio,
      total_estudiantes: estudiantes.length,
      total_preguntas: preguntas.length
    };
    
    res.json({
      message: 'Encuesta programada para envío',
      programacion
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Backend de Encuestas funcionando');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
