CREATE DATABASE IF NOT EXISTS encuestas_postgrado;
USE encuestas_postgrado;

-- 📘 Tabla de ciclos académicos
CREATE TABLE ciclos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL -- Ej: 2025-I
);

-- 📘 Tabla de secciones
CREATE TABLE secciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(10) NOT NULL,  -- Ej: A, B, C
  ciclo_id INT NOT NULL,
  FOREIGN KEY (ciclo_id) REFERENCES ciclos(id)
);

-- 👨‍🏫 Docentes
CREATE TABLE docentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  celular VARCHAR(15) -- opcional para notificaciones
);

-- 📚 Cursos
CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  docente_id INT NOT NULL,
  seccion_id INT NOT NULL,
  FOREIGN KEY (docente_id) REFERENCES docentes(id),
  FOREIGN KEY (seccion_id) REFERENCES secciones(id)
);

-- 👩‍🎓 Estudiantes
CREATE TABLE estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  celular VARCHAR(15) NOT NULL,
  curso_id INT NOT NULL,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- 📝 Encuestas
CREATE TABLE encuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  curso_id INT NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- ❓ Preguntas de encuesta
CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuesta_id INT NOT NULL,
  texto TEXT NOT NULL,
  orden INT DEFAULT 1,
  FOREIGN KEY (encuesta_id) REFERENCES encuestas(id)
);

-- ✅ Respuestas de estudiantes
CREATE TABLE respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  pregunta_id INT NOT NULL,
  respuesta_texto TEXT,
  fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);
