import React from 'react'

function Dashboard({ data }) {
  const { encuestas = [], estudiantes = [], cursos = [], docentes = [] } = data

  // Verificar si los datos están cargando (arrays vacíos)
  const isLoading = encuestas.length === 0 && estudiantes.length === 0 && 
                   cursos.length === 0 && docentes.length === 0

  if (isLoading) {
    return (
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="loading">
          <p>Cargando datos...</p>
          <p>Verificando conexión con el servidor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{encuestas.length}</h3>
            <p>Encuestas</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{estudiantes.length}</h3>
            <p>Estudiantes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{cursos.length}</h3>
            <p>Cursos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>{docentes.length}</h3>
            <p>Docentes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Encuestas Recientes</h3>
        <div className="recent-list">
          {encuestas.length > 0 ? (
            encuestas.slice(0, 5).map((encuesta, index) => (
              <div key={index} className="recent-item">
                <div className="recent-content">
                  <h4>{encuesta.titulo || `Encuesta ${index + 1}`}</h4>
                  <p>{encuesta.descripcion || 'Sin descripción'}</p>
                  <small>{encuesta.fecha_creacion || 'Fecha no disponible'}</small>
                </div>
                <div className="recent-actions">
                  <button className="btn btn-small btn-secondary">Ver</button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay encuestas disponibles</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Acciones Rápidas</h3>
        <div className="quick-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/crear-encuesta'}
          >
            Crear Nueva Encuesta
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/encuestas'}
          >
            Ver Todas las Encuestas
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/estudiantes'}
          >
            Gestionar Estudiantes
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/cursos'}
          >
            Gestionar Cursos
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 