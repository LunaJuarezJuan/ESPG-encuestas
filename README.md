# 📋 Sistema de Encuestas ESPG - Postgrado

Sistema web completo para gestionar encuestas académicas con envío automático por WhatsApp.

## 🚀 Características

- **Gestión de Encuestas**: Crear, editar y gestionar encuestas con preguntas dinámicas
- **Gestión de Estudiantes**: Registrar estudiantes con sus números de WhatsApp
- **Gestión de Cursos**: Administrar cursos, docentes y secciones
- **Envío por WhatsApp**: Programar envío automático de encuestas por WhatsApp
- **Dashboard**: Estadísticas y resumen del sistema
- **Interfaz Moderna**: Diseño responsive y fácil de usar

## 🛠️ Tecnologías

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: MySQL
- **WhatsApp Bot**: Venom-bot
- **Contenedores**: Docker + Docker Compose

## 📦 Instalación

### Prerrequisitos

- Docker
- Docker Compose

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ESPG-encuestas
   ```

2. **Desplegar con Docker**
   ```bash
   docker-compose up --build
   ```

3. **Acceder al sistema**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **ciclos**: Ciclos académicos (2025-I, 2024-II, etc.)
- **secciones**: Secciones por ciclo (A, B, C, etc.)
- **docentes**: Información de docentes
- **cursos**: Cursos con docente y sección asignados
- **estudiantes**: Estudiantes con números de WhatsApp
- **encuestas**: Encuestas creadas
- **preguntas**: Preguntas de cada encuesta
- **respuestas**: Respuestas de los estudiantes

## 📱 Uso del Sistema

### 1. Configuración Inicial

1. **Agregar Docentes**
   - Ir a "Docentes" en el menú
   - Hacer clic en "Agregar Docente"
   - Completar nombre y celular (opcional)

2. **Crear Cursos**
   - Ir a "Cursos" en el menú
   - Hacer clic en "Agregar Curso"
   - Seleccionar docente y sección
   - Asignar nombre del curso

3. **Registrar Estudiantes**
   - Ir a "Estudiantes" en el menú
   - Hacer clic en "Agregar Estudiante"
   - Completar nombre, celular y curso

### 2. Crear Encuestas

1. **Crear Nueva Encuesta**
   - Ir a "Crear Encuesta" en el menú
   - Completar título y seleccionar curso
   - Agregar preguntas dinámicamente
   - Guardar encuesta

2. **Gestionar Encuestas**
   - Ir a "Encuestas" en el menú
   - Ver lista de encuestas creadas
   - Ver detalles y preguntas
   - Programar envío por WhatsApp

### 3. Envío por WhatsApp

1. **Configurar Bot de WhatsApp**
   - El bot ya está configurado en `backend/whatsappBot.js`
   - Se ejecuta automáticamente al programar envío

2. **Programar Envío**
   - Desde la vista de encuestas
   - Hacer clic en "Enviar por WhatsApp"
   - Confirmar envío

## 🔧 Configuración del Bot de WhatsApp

### Archivo: `backend/whatsappBot.js`

```javascript
// Configuración del bot
venom.create({
  session: 'post_encuesta_bot',
  multidevice: true,
  headless: true,
  // ... configuración adicional
})
```

### Uso Manual del Bot

```bash
cd backend
node whatsappBot.js
```

## 📊 API Endpoints

### Ciclos
- `GET /api/ciclos` - Listar ciclos
- `POST /api/ciclos` - Crear ciclo

### Secciones
- `GET /api/secciones` - Listar secciones
- `POST /api/secciones` - Crear sección

### Docentes
- `GET /api/docentes` - Listar docentes
- `POST /api/docentes` - Crear docente

### Cursos
- `GET /api/cursos` - Listar cursos
- `POST /api/cursos` - Crear curso

### Estudiantes
- `GET /api/estudiantes` - Listar estudiantes
- `POST /api/estudiantes` - Crear estudiante

### Encuestas
- `GET /api/encuestas` - Listar encuestas
- `POST /api/encuestas` - Crear encuesta

### Preguntas
- `GET /api/preguntas/:encuesta_id` - Listar preguntas
- `POST /api/preguntas` - Crear pregunta

### Envío WhatsApp
- `POST /api/enviar-encuesta` - Programar envío

## 🐳 Comandos Docker Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose up --build
```

## 📁 Estructura del Proyecto

```
ESPG-encuestas/
├── backend/
│   ├── index.js          # API principal
│   ├── whatsappBot.js    # Bot de WhatsApp
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── App.jsx       # Componente principal
│   │   └── App.css       # Estilos
│   └── package.json
├── encuesta.sql          # Esquema de BD
├── datos_ejemplo.sql     # Datos de ejemplo
├── docker-compose.yml    # Configuración Docker
└── README.md
```

## 🔒 Seguridad

- Las contraseñas de la BD están en variables de entorno
- El bot de WhatsApp usa sesiones seguras
- API protegida con CORS configurado

## 🚨 Solución de Problemas

### Error de Conexión a MySQL
```bash
# Verificar que MySQL esté corriendo
docker-compose logs mysql
```

### Error del Bot de WhatsApp
```bash
# Verificar logs del bot
docker-compose logs backend
```

### Error del Frontend
```bash
# Reconstruir frontend
docker-compose up --build frontend
```

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema, contactar al equipo de desarrollo.

## 📝 Licencia

Este proyecto es para uso interno de ESPG - Postgrado. 