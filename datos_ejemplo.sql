-- Datos de ejemplo para el sistema de encuestas
USE encuestas_postgrado;

-- Insertar ciclos académicos
INSERT INTO ciclos (nombre) VALUES 
('2025-I'),
('2024-II'),
('2024-I');

-- Insertar secciones
INSERT INTO secciones (nombre, ciclo_id) VALUES 
('A', 1),
('B', 1),
('C', 1),
('A', 2),
('B', 2);

-- Insertar docentes
INSERT INTO docentes (nombre, celular) VALUES 
('Dr. María González', '51987654321'),
('Prof. Carlos Rodríguez', '51912345678'),
('Dra. Ana Martínez', '51955555555'),
('Prof. Luis Pérez', '51999999999');

-- Insertar cursos
INSERT INTO cursos (nombre, docente_id, seccion_id) VALUES 
('Matemáticas Avanzadas', 1, 1),
('Física Cuántica', 2, 2),
('Programación Web', 3, 3),
('Estadística Aplicada', 4, 4),
('Inteligencia Artificial', 1, 5);

-- Insertar estudiantes
INSERT INTO estudiantes (nombre, celular, curso_id) VALUES 
('Juan Pérez', '51911111111', 1),
('María López', '51922222222', 1),
('Carlos García', '51933333333', 2),
('Ana Torres', '51944444444', 2),
('Luis Morales', '51955555555', 3),
('Carmen Ruiz', '51966666666', 3),
('Roberto Silva', '51977777777', 4),
('Patricia Vega', '51988888888', 4),
('Fernando Castro', '51999999999', 5),
('Diana Mendoza', '51900000000', 5);

-- Insertar encuestas de ejemplo
INSERT INTO encuestas (titulo, curso_id) VALUES 
('Evaluación del Curso de Matemáticas Avanzadas', 1),
('Satisfacción con el Curso de Física Cuántica', 2),
('Feedback del Curso de Programación Web', 3);

-- Insertar preguntas para la primera encuesta
INSERT INTO preguntas (encuesta_id, texto, orden) VALUES 
(1, '¿Cómo calificarías la claridad de las explicaciones del docente?', 1),
(1, '¿El material de estudio fue suficiente y adecuado?', 2),
(1, '¿Recomendarías este curso a otros estudiantes?', 3),
(1, '¿Qué aspectos del curso te gustaron más?', 4),
(1, '¿Qué sugerencias tienes para mejorar el curso?', 5);

-- Insertar preguntas para la segunda encuesta
INSERT INTO preguntas (encuesta_id, texto, orden) VALUES 
(2, '¿El nivel de dificultad del curso fue apropiado?', 1),
(2, '¿Los laboratorios fueron útiles para tu aprendizaje?', 2),
(2, '¿Cómo calificarías la organización del curso?', 3);

-- Insertar preguntas para la tercera encuesta
INSERT INTO preguntas (encuesta_id, texto, orden) VALUES 
(3, '¿Los proyectos prácticos fueron relevantes?', 1),
(3, '¿El uso de tecnologías modernas fue adecuado?', 2),
(3, '¿Cómo calificarías la metodología de enseñanza?', 3),
(3, '¿Qué tecnologías te gustaría aprender en el futuro?', 4); 