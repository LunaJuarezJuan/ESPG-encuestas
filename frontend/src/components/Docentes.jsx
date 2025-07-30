import React, { useState, useEffect } from 'react'

const Docentes = ({ data, updateData, fetchData }) => {
  const [docentes, setDocentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: ''
  })

  useEffect(() => {
    loadDocentes()
  }, [])

  const loadDocentes = async () => {
    setLoading(true)
    try {
      const docentesData = await fetchData('/docentes')
      setDocentes(docentesData)
      updateData('docentes', docentesData)
    } catch (error) {
      console.error('Error cargando docentes:', error)
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
    
    if (!formData.nombre) {
      alert('Por favor ingresa el nombre del docente')
      return
    }

    try {
      const response = await fetchData('/docentes', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.id) {
        alert('Docente agregado exitosamente')
        setFormData({ nombre: '', celular: '' })
        setShowForm(false)
        loadDocentes()
      }
    } catch (error) {
      console.error('Error agregando docente:', error)
      alert('Error al agregar docente')
    }
  }

  if (loading) {
    return <div className="loading">Cargando docentes...</div>
  }

  return (
    <div className="docentes">
      <div className="page-header">
        <h2>👨‍🏫 Docentes</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? '❌ Cancelar' : '➕ Agregar Docente'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Agregar Nuevo Docente</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Dr. María González"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="celular">Número de Celular (Opcional)</label>
              <input
                type="tel"
                id="celular"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                placeholder="Ej: 51987654321"
              />
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
                Agregar Docente
              </button>
            </div>
          </form>
        </div>
      )}

      {docentes.length > 0 ? (
        <div className="docentes-grid">
          {docentes.map(docente => (
            <div key={docente.id} className="docente-card">
              <div className="docente-header">
                <h3>{docente.nombre}</h3>
                {docente.celular && (
                  <span className="docente-celular">📱 {docente.celular}</span>
                )}
              </div>
              
              <div className="docente-actions">
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
          <p>No hay docentes registrados aún.</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
          >
            ➕ Agregar Primer Docente
          </button>
        </div>
      )}
    </div>
  )
}

export default Docentes 