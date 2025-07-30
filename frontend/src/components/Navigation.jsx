import React from 'react'

const Navigation = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'encuestas', label: 'Encuestas', icon: '📝' },
    { id: 'crear-encuesta', label: 'Crear Encuesta', icon: '➕' },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👨‍🎓' },
    { id: 'cursos', label: 'Cursos', icon: '📚' },
    { id: 'docentes', label: 'Docentes', icon: '👨‍🏫' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>🎓 ESPG Encuestas</h1>
        <p>Sistema de Gestión de Encuestas</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Postgrado - 2025
        </p>
      </div>
      
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            <button
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation 