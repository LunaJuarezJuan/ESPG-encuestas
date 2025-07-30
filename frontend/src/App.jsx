import { useState, useEffect } from 'react'
import './App.css'

// Componentes
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import Encuestas from './components/Encuestas'
import CrearEncuesta from './components/CrearEncuesta'
import Estudiantes from './components/Estudiantes'
import Cursos from './components/Cursos'
import Docentes from './components/Docentes'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [data, setData] = useState({
    ciclos: [],
    secciones: [],
    docentes: [],
    cursos: [],
    estudiantes: [],
    encuestas: []
  })

  const API_BASE = 'http://localhost:4000/api'

  // Función para hacer peticiones a la API
  const fetchData = async (endpoint, options = {}) => {
    try {
      console.log(`Fetching: ${API_BASE}${endpoint}`)
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`Data received for ${endpoint}:`, data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      const [ciclos, docentes, cursos, encuestas] = await Promise.all([
        fetchData('/ciclos'),
        fetchData('/docentes'),
        fetchData('/cursos'),
        fetchData('/encuestas')
      ])

      setData(prev => ({
        ...prev,
        ciclos,
        docentes,
        cursos,
        encuestas
      }))
    }

    loadInitialData()
  }, [])

  // Función para actualizar datos
  const updateData = (key, newData) => {
    setData(prev => ({
      ...prev,
      [key]: newData
    }))
  }

  // Función para agregar nuevo elemento
  const addItem = (key, newItem) => {
    setData(prev => ({
      ...prev,
      [key]: [...prev[key], newItem]
    }))
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={data} />
      case 'encuestas':
        return <Encuestas 
          data={data} 
          updateData={updateData}
          fetchData={fetchData}
        />
      case 'crear-encuesta':
        return <CrearEncuesta 
          data={data}
          addItem={addItem}
          fetchData={fetchData}
          setCurrentView={setCurrentView}
        />
      case 'estudiantes':
        return <Estudiantes 
          data={data}
          updateData={updateData}
          fetchData={fetchData}
        />
      case 'cursos':
        return <Cursos 
          data={data}
          updateData={updateData}
          fetchData={fetchData}
        />
      case 'docentes':
        return <Docentes 
          data={data}
          updateData={updateData}
          fetchData={fetchData}
        />
      default:
        return <Dashboard data={data} />
    }
  }

  return (
    <div className="app">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderView()}
      </main>
      <footer className="app-footer">
        <p>© 2025 ESPG - Sistema de Encuestas | Desarrollado con ❤️</p>
      </footer>
    </div>
  )
}

export default App
