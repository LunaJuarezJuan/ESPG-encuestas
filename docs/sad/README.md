# Software Architecture Document (SAD)
## Sistema de Encuestas ESPG - Postgrado

## ÍNDICE GENERAL
1. [Introducción](#1-introducción)
2. [Representación Arquitectónica](#2-representación-arquitectónica) 
3. [Objetivos y limitaciones arquitectónicas](#3-objetivos-y-limitaciones-arquitectónicas)
4. [Análisis de Requerimientos](#4-análisis-de-requerimientos)
5. [Vistas de Caso de Uso](#5-vistas-de-caso-de-uso)
6. [Vista Lógica](#6-vista-lógica)
7. [Vista de Procesos](#7-vista-de-procesos)
8. [Vista de Despliegue](#8-vista-de-despliegue)
9. [Vista de Implementación](#9-vista-de-implementación)
10. [Vista de Datos](#10-vista-de-datos)
11. [Calidad](#11-calidad)

## 1. Introducción

### 1.1 Propósito
Este documento presenta la arquitectura del Sistema de Encuestas ESPG - Postgrado, describiendo las decisiones arquitectónicas tomadas para su implementación.

### 1.2 Alcance
Abarca la descripción detallada de la arquitectura del sistema, incluyendo vistas arquitectónicas, patrones y decisiones de diseño.

### 1.3 Definiciones, siglas y abreviaturas
- **ESPG**: Escuela de Postgrado
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **ORM**: Object-Relational Mapping

### 1.4 Referencias
- Documentación React: https://reactjs.org/
- Documentación Node.js: https://nodejs.org/
- Especificaciones de Docker: https://docs.docker.com/
- Documentación Venom-bot: https://github.com/orkestral/venom

### 1.5 Visión General
El sistema implementa una arquitectura de 3 capas (frontend, backend, base de datos) con tecnologías web modernas para gestionar encuestas académicas, integrando un bot de WhatsApp para el envío automatizado de encuestas.

## 2. Representación Arquitectónica

### 2.1 Escenarios

```mermaid
graph TD
    A[Usuario Administrador] -->|Accede vía navegador| B[Frontend React]
    B -->|Solicita datos API REST| C[Backend Node.js]
    C -->|Consulta/Actualiza| D[Base de Datos MySQL]
    C -->|Envía mensajes| E[WhatsApp Bot Venom]
    E -->|Mensajes WhatsApp| F[Estudiantes]
    F -->|Responde encuesta| B
```

### 2.2 Vista Lógica
Arquitectura basada en componentes React para el frontend y servicios REST para el backend.

```mermaid
graph TB
    subgraph "Capa de Presentación"
        A[Componentes React]
        B[Páginas]
        C[Servicios HTTP]
    end
    
    subgraph "Capa de Negocio"
        D[Controladores API]
        E[Servicios de Negocio]
        F[Middleware]
    end
    
    subgraph "Capa de Datos"
        G[Modelos]
        H[Repositorios]
        I[Base de Datos MySQL]
    end
    
    A --> C
    B --> A
    C --> D
    D --> E
    E --> G
    G --> H
    H --> I
```

### 2.3 Vista del Proceso
Flujo asíncrono de comunicación entre componentes mediante API REST.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend API
    participant DB as Base de Datos
    participant W as WhatsApp Bot
    
    U->>F: Crear Encuesta
    F->>B: POST /api/encuestas
    B->>DB: INSERT encuesta
    DB-->>B: ID encuesta
    B-->>F: Encuesta creada
    F-->>U: Confirmación
    
    U->>F: Enviar por WhatsApp
    F->>B: POST /api/enviar-encuesta
    B->>W: Programar envío
    W->>W: Procesar cola
    W-->>B: Estado enviado
    B-->>F: Confirmación envío
```

### 2.4 Vista del Desarrollo
Desarrollo modular con separación clara de responsabilidades.

```mermaid
graph LR
    subgraph "Frontend - React"
        A[src/components]
        B[src/pages]
        C[src/services]
        D[src/utils]
    end
    
    subgraph "Backend - Node.js"
        E[controllers/]
        F[models/]
        G[routes/]
        H[middleware/]
        I[bot/]
    end
    
    subgraph "Base de Datos"
        J[Esquema MySQL]
        K[Scripts SQL]
    end
    
    A --> C
    B --> A
    C --> E
    E --> F
    F --> J
    I --> F
```

### 2.5 Vista Física
Despliegue en contenedores Docker para garantizar portabilidad.

```mermaid
graph TB
    subgraph "Docker Host"
        subgraph "Container: Frontend"
            A[React App<br/>Puerto 3000]
        end
        
        subgraph "Container: Backend"
            B[Node.js API<br/>Puerto 4000]
            C[WhatsApp Bot]
        end
        
        subgraph "Container: Database"
            D[MySQL<br/>Puerto 3306]
        end
    end
    
    E[Usuario Web] -->|HTTP| A
    A -->|API REST| B
    B -->|SQL| D
    C -->|WhatsApp API| F[Servicio WhatsApp]
```

## 3. Objetivos y limitaciones arquitectónicas

### 3.1 Disponibilidad
- Tiempo de actividad objetivo: 99.9%
- Respaldo automático de datos diario
- Manejo robusto de errores
- Logs de sistema completos

### 3.2 Seguridad
- Autenticación mediante JWT
- Encriptación de contraseñas con bcrypt
- Validación de datos de entrada
- Control de acceso basado en roles
- Protección contra SQL Injection
- CORS configurado apropiadamente

### 3.3 Adaptabilidad
- Diseño modular y desacoplado
- Interfaces bien definidas
- Configuración externalizada
- API RESTful versionada
- Código documentado

### 3.4 Rendimiento
- Tiempo de respuesta objetivo: < 2 segundos
- Optimización de consultas SQL
- Paginación de resultados
- Caché de datos frecuentes
- Compresión de respuestas HTTP

## 4. Análisis de Requerimientos

### 4.1 Requerimientos funcionales
| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RF01 | Gestión de Encuestas | CRUD completo de encuestas con preguntas dinámicas |
| RF02 | Gestión de Estudiantes | Registro y administración de estudiantes |
| RF03 | Gestión de Cursos | Administrar cursos, docentes y secciones |
| RF04 | Envío WhatsApp | Automatización de envío de encuestas vía WhatsApp |
| RF05 | Dashboard | Visualización de estadísticas y reportes |
| RF06 | Respuestas | Registro y consulta de respuestas de estudiantes |

### 4.2 Requerimientos no funcionales
| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF01 | Seguridad | Protección de datos sensibles y autenticación |
| RNF02 | Escalabilidad | Soporte para crecimiento de usuarios |
| RNF03 | Usabilidad | Interfaz intuitiva y responsive |
| RNF04 | Rendimiento | Tiempos de respuesta óptimos |
| RNF05 | Mantenibilidad | Código limpio y documentado |
| RNF06 | Portabilidad | Despliegue mediante contenedores |

## 5. Vistas de Caso de Uso

```mermaid
graph TD
    Admin((Administrador))
    Doc((Docente))
    Est((Estudiante))
    
    Admin --> UC1[Gestionar Encuestas]
    Admin --> UC2[Gestionar Estudiantes]
    Admin --> UC3[Gestionar Cursos]
    Admin --> UC4[Enviar Encuestas]
    Admin --> UC5[Ver Dashboard]
    
    Doc --> UC6[Consultar Resultados]
    Doc --> UC7[Ver Estadísticas]
    
    Est --> UC8[Responder Encuesta]
    Est --> UC9[Ver Mis Encuestas]
    
    UC1 --> UC10[Crear Encuesta]
    UC1 --> UC11[Editar Encuesta]
    UC1 --> UC12[Eliminar Encuesta]
```

## 6. Vista Lógica

### 6.1 Diagrama Contextual

```mermaid
graph LR
    A[Frontend React] -->|API REST HTTP/JSON| B[Backend Node.js]
    B -->|SQL Queries| C[MySQL Database]
    B -->|Bot SDK| D[WhatsApp Bot]
    D -->|WhatsApp API| E[Servicio WhatsApp]
    
    F[Administrador] ---|Navegador Web| A
    G[Estudiante] ---|WhatsApp| E
```

### 6.2 Diagrama de Paquetes

```mermaid
graph TB
    subgraph "Frontend Package"
        A[components/]
        B[pages/]
        C[services/]
        D[utils/]
    end
    
    subgraph "Backend Package"
        E[controllers/]
        F[models/]
        G[routes/]
        H[middleware/]
        I[bot/]
        J[config/]
    end
    
    subgraph "Database Package"
        K[schemas/]
        L[migrations/]
        M[seeds/]
    end
    
    B --> A
    A --> C
    C --> E
    E --> F
    F --> K
    I --> F
    G --> E
    H --> G
```

## 7. Vista de Procesos

### 7.1 Diagrama de Proceso Actual (Antes del Sistema)

```mermaid
graph TD
    A[Inicio] -->|Manual| B[Crear Encuesta en Google Forms]
    B -->|Manual| C[Copiar enlace]
    C -->|Email/Manual| D[Enviar a estudiantes]
    D -->|Espera pasiva| E[Estudiantes responden]
    E -->|Manual| F[Descargar respuestas]
    F -->|Manual| G[Procesar en Excel]
    G -->|Manual| H[Generar reportes]
    H --> I[Fin]
```

### 7.2 Diagrama de Proceso Propuesto (Con el Sistema)

```mermaid
graph TD
    A[Inicio] -->|Automatizado| B[Crear Encuesta en Sistema]
    B -->|Un clic| C[Programar envío WhatsApp]
    C -->|Automático| D[Bot envía a estudiantes]
    D -->|Notificaciones| E[Estudiantes responden]
    E -->|Automático| F[Sistema registra respuestas]
    F -->|Tiempo real| G[Dashboard actualizado]
    G -->|Automático| H[Reportes disponibles]
    H --> I[Fin]
```

## 8. Vista de Despliegue

### 8.1 Diagrama de Contenedor

```mermaid
graph TB
    subgraph "Docker Compose Orchestration"
        subgraph "Frontend Container"
            A[Nginx<br/>React Build<br/>Puerto 3000]
        end
        
        subgraph "Backend Container"
            B[Node.js<br/>Express API<br/>Puerto 4000]
            C[Venom Bot<br/>WhatsApp Client]
        end
        
        subgraph "Database Container"
            D[MySQL 8.0<br/>Puerto 3306<br/>Volumen persistente]
        end
        
        subgraph "Network Bridge"
            E[Docker Network]
        end
    end
    
    F[Internet] -->|HTTP/HTTPS| A
    A -->|API Calls| B
    B -->|SQL| D
    C -->|WebSocket| G[WhatsApp Servers]
    
    A -.->|Network| E
    B -.->|Network| E
    D -.->|Network| E
```

## 9. Vista de Implementación

### 9.1 Diagrama de Componentes

```mermaid
graph TB
    subgraph "Frontend Components"
        A[App Component]
        B[Dashboard Component]
        C[Encuestas Component]
        D[Estudiantes Component]
        E[API Service]
    end
    
    subgraph "Backend Components"
        F[Express Server]
        G[Encuestas Controller]
        H[Estudiantes Controller]
        I[WhatsApp Bot Manager]
        J[Database Connection]
    end
    
    subgraph "Database Components"
        K[Encuestas Table]
        L[Estudiantes Table]
        M[Respuestas Table]
        N[Cursos Table]
    end
    
    A --> B
    A --> C
    A --> D
    B --> E
    C --> E
    D --> E
    
    E -->|HTTP| F
    F --> G
    F --> H
    F --> I
    
    G --> J
    H --> J
    
    J --> K
    J --> L
    J --> M
    J --> N
```

## 10. Vista de Datos

### 10.1 Diagrama Entidad Relación

```mermaid
erDiagram
    CICLO ||--o{ SECCION : tiene
    CICLO {
        int id PK
        string nombre
        date fecha_inicio
        date fecha_fin
    }
    
    SECCION ||--o{ CURSO : tiene
    SECCION {
        int id PK
        int ciclo_id FK
        string nombre
    }
    
    DOCENTE ||--o{ CURSO : imparte
    DOCENTE {
        int id PK
        string nombre
        string celular
    }
    
    CURSO ||--o{ ESTUDIANTE : inscribe
    CURSO {
        int id PK
        int seccion_id FK
        int docente_id FK
        string nombre
    }
    
    ESTUDIANTE ||--o{ RESPUESTA : responde
    ESTUDIANTE {
        int id PK
        int curso_id FK
        string nombre
        string celular
    }
    
    ENCUESTA ||--o{ PREGUNTA : contiene
    ENCUESTA {
        int id PK
        int curso_id FK
        string titulo
        datetime fecha_creacion
        boolean activa
    }
    
    PREGUNTA ||--o{ RESPUESTA : tiene
    PREGUNTA {
        int id PK
        int encuesta_id FK
        string texto
        string tipo
        int orden
    }
    
    RESPUESTA {
        int id PK
        int estudiante_id FK
        int pregunta_id FK
        string respuesta
        datetime fecha_respuesta
    }
```

## 11. Calidad

### 11.1 Escenario de Seguridad

**Atributo de Calidad:** Seguridad  
**Estímulo:** Usuario no autenticado intenta acceder a endpoints protegidos  
**Respuesta:** El sistema deniega el acceso y registra el intento

```mermaid
sequenceDiagram
    participant U as Usuario No Auth
    participant F as Frontend
    participant M as Middleware Auth
    participant B as Backend
    
    U->>F: Intenta acceder
    F->>M: Request sin token
    M->>M: Valida token
    M-->>F: 401 Unauthorized
    F-->>U: Redirige a login
    M->>B: Log intento no autorizado
```

### 11.2 Escenario de Usabilidad

**Atributo de Calidad:** Usabilidad  
**Estímulo:** Usuario crea nueva encuesta  
**Respuesta:** Proceso intuitivo con feedback en cada paso

**Características:**
- Interfaz responsive
- Validación en tiempo real
- Mensajes claros de error/éxito
- Diseño consistente
- Navegación intuitiva

### 11.3 Escenario de Adaptabilidad

**Atributo de Calidad:** Adaptabilidad  
**Estímulo:** Se requiere agregar nuevo tipo de pregunta  
**Respuesta:** Módulo de preguntas permite extensión sin modificar código existente

**Estrategias:**
- Arquitectura modular
- Componentes reutilizables
- Configuración externalizada
- API versionada
- Interfaces bien definidas

### 11.4 Escenario de Disponibilidad

**Atributo de Calidad:** Disponibilidad  
**Estímulo:** Fallo en conexión a base de datos  
**Respuesta:** Sistema maneja error gracefully y notifica administrador

```mermaid
graph TD
    A[Request] --> B{DB Disponible?}
    B -->|Sí| C[Procesar normal]
    B -->|No| D[Activar fallback]
    D --> E[Intentar reconexión]
    E --> F{Reconectado?}
    F -->|Sí| C
    F -->|No| G[Notificar admin]
    G --> H[Mostrar mensaje usuario]
```

### 11.5 Escenario de Rendimiento

**Atributo de Calidad:** Rendimiento  
**Estímulo:** 100 estudiantes responden encuesta simultáneamente  
**Respuesta:** Sistema procesa todas las respuestas en < 3 segundos

**Estrategias de optimización:**
- Índices en base de datos
- Paginación de resultados
- Compresión de respuestas
- Caché de consultas frecuentes
- Procesamiento asíncrono

---

**Documento elaborado por:** Equipo de Desarrollo ESPG  
**Fecha:** Noviembre 2025  
**Versión:** 1.0