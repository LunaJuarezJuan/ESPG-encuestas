import React, { useState } from 'react'

const CrearEncuesta = ({ data, addItem, fetchData, setCurrentView }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    curso_id: '',
    preguntas: [
      { texto: '', orden: 1 }
    ]
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreguntaChange = (index, value) => {
    const newPreguntas = [...formData.preguntas]
    newPreguntas[index].texto = value
    setFormData(prev => ({
      ...prev,
      preguntas: newPreguntas
    }))
  }

  const addPregunta = () => {
    setFormData(prev => ({
      ...prev,
      preguntas: [
        ...prev.preguntas,
        { texto: '', orden: prev.preguntas.length + 1 }
      ]
    }))
  }

  const removePregunta = (index) => {
    if (formData.preguntas.length > 1) {
      const newPreguntas = formData.preguntas.filter((_, i) => i !== index)
        .map((pregunta, i) => ({ ...pregunta, orden: i + 1 }))
      
      setFormData(prev => ({
        ...prev,
        preguntas: newPreguntas
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.curso_id) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.preguntas.some(p => !p.texto.trim())) {
      alert('Por favor completa todas las preguntas')
      return
    }

    setLoading(true)

    try {
      // Crear la encuesta
      const encuestaResponse = await fetchData('/encuestas', {
        method: 'POST',
        body: JSON.stringify({
          titulo: formData.titulo,
          curso_id: formData.curso_id
        })
      })

      if (encuestaResponse.id) {
        // Crear las preguntas
        for (const pregunta of formData.preguntas) {
          await fetchData('/preguntas', {
            method: 'POST',
            body: JSON.stringify({
              encuesta_id: encuestaResponse.id,
              texto: pregunta.texto,
              orden: pregunta.orden
            })
          })
        }

        alert('Encuesta creada exitosamente')
        setCurrentView('encuestas')
      }
    } catch (error) {
      console.error('Error al crear encuesta:', error)
      alert('Error al crear la encuesta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crear-encuesta">
      <h2>➕ Crear Nueva Encuesta</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="titulo">Título de la Encuesta *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            placeholder="Ej: Evaluación del Curso de Matemáticas"
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

        <div className="form-section">
          <div className="section-header">
            <h3>❓ Preguntas</h3>
            <button
              type="button"
              onClick={addPregunta}
              className="btn btn-secondary"
            >
              ➕ Agregar Pregunta
            </button>
          </div>

          {formData.preguntas.map((pregunta, index) => (
            <div key={index} className="pregunta-item">
              <div className="pregunta-header">
                <span className="pregunta-numero">Pregunta {index + 1}</span>
                {formData.preguntas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePregunta(index)}
                    className="btn btn-danger btn-small"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <textarea
                value={pregunta.texto}
                onChange={(e) => handlePreguntaChange(index, e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                rows="3"
                required
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => setCurrentView('encuestas')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Encuesta'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CrearEncuesta 