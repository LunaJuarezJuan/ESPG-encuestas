import React, { useState, useEffect } from 'react'

const Cursos = ({ data, updateData, fetchData }) => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    docente_id: '',
    seccion_id: ''
  })

  useEffect(() => {
    loadCursos()
  }, [])

  const loadCursos = async () => {
    setLoading(true)
    try {
      const cursosData = await fetchData('/cursos')
      setCursos(cursosData)
      updateData('cursos', cursosData)
    } catch (error) {
      console.error('Error cargando cursos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.docente_id || !formData.seccion_id) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      const response = await fetchData('/cursos', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.id) {
        alert('Curso agregado exitosamente')
        setFormData({ nombre: '', docente_id: '', seccion_id: '' })
        setShowForm(false)
        loadCursos()
      }
    } catch (error) {
      console.error('Error agregando curso:', error)
      alert('Error al agregar curso')
    }
  }

  if (loading) {
    return <div className="loading">Cargando cursos...</div>
  }

  return (
    <div className="cursos">
      <div className="page-header">
        <h2>📚 Cursos</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? '❌ Cancelar' : '➕ Agregar Curso'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Agregar Nuevo Curso</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Curso *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Matemáticas Avanzadas"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="docente_id">Docente *</label>
              <select
                id="docente_id"
                name="docente_id"
                value={formData.docente_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un docente</option>
                {data.docentes.map(docente => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="seccion_id">Sección *</label>
              <select
                id="seccion_id"
                name="seccion_id"
                value={formData.seccion_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una sección</option>
                {data.secciones.map(seccion => (
                  <option key={seccion.id} value={seccion.id}>
                    {seccion.nombre} - {seccion.ciclo_nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Agregar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      {cursos.length > 0 ? (
        <div className="cursos-grid">
          {cursos.map(curso => (
            <div key={curso.id} className="curso-card">
              <div className="curso-header">
                <h3>{curso.nombre}</h3>
                <span className="curso-seccion">{curso.seccion_nombre}</span>
              </div>
              
              <div className="curso-info">
                <p><strong>Docente:</strong> {curso.docente_nombre}</p>
                <p><strong>Ciclo:</strong> {curso.ciclo_nombre}</p>
              </div>
              
              <div className="curso-actions">
                <button className="btn btn-small btn-secondary">
                  ✏️ Editar
                </button>
                <button className="btn btn-small btn-danger">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No hay cursos registrados aún.</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
          >
            ➕ Agregar Primer Curso
          </button>
        </div>
      )}
    </div>
  )
}

export default Cursos 