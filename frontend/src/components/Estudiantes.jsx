import React, { useState, useEffect } from 'react'

const Estudiantes = ({ data, updateData, fetchData }) => {
  const [estudiantes, setEstudiantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    curso_id: ''
  })

  useEffect(() => {
    loadEstudiantes()
  }, [])

  const loadEstudiantes = async () => {
    setLoading(true)
    try {
      const estudiantesData = await fetchData('/estudiantes')
      setEstudiantes(estudiantesData)
      updateData('estudiantes', estudiantesData)
    } catch (error) {
      console.error('Error cargando estudiantes:', error)
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
    
    if (!formData.nombre || !formData.celular || !formData.curso_id) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      const response = await fetchData('/estudiantes', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.id) {
        alert('Estudiante agregado exitosamente')
        setFormData({ nombre: '', celular: '', curso_id: '' })
        setShowForm(false)
        loadEstudiantes()
      }
    } catch (error) {
      console.error('Error agregando estudiante:', error)
      alert('Error al agregar estudiante')
    }
  }

  if (loading) {
    return <div className="loading">Cargando estudiantes...</div>
  }

  return (
    <div className="estudiantes">
      <div className="page-header">
        <h2>👨‍🎓 Estudiantes</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? '❌ Cancelar' : '➕ Agregar Estudiante'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Agregar Nuevo Estudiante</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="celular">Número de Celular *</label>
              <input
                type="tel"
                id="celular"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                placeholder="Ej: 51987654321"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="curso_id">Curso *</label>
              <select
                id="curso_id"
                name="curso_id"
                value={formData.curso_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un curso</option>
                {data.cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre} - {curso.docente_nombre} ({curso.seccion_nombre})
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
                Agregar Estudiante
              </button>
            </div>
          </form>
        </div>
      )}

      {estudiantes.length > 0 ? (
        <div className="estudiantes-grid">
          {estudiantes.map(estudiante => (
            <div key={estudiante.id} className="estudiante-card">
              <div className="estudiante-header">
                <h3>{estudiante.nombre}</h3>
                <span className="estudiante-celular">📱 {estudiante.celular}</span>
              </div>
              
              <div className="estudiante-info">
                <p><strong>Curso:</strong> {estudiante.curso_nombre}</p>
                <p><strong>Docente:</strong> {estudiante.docente_nombre}</p>
                <p><strong>Sección:</strong> {estudiante.seccion_nombre}</p>
                <p><strong>Ciclo:</strong> {estudiante.ciclo_nombre}</p>
              </div>
              
              <div className="estudiante-actions">
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
          <p>No hay estudiantes registrados aún.</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
          >
            ➕ Agregar Primer Estudiante
          </button>
        </div>
      )}
    </div>
  )
}

export default Estudiantes 