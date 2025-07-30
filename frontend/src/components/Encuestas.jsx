import React, { useState, useEffect } from 'react'

const Encuestas = ({ data, updateData, fetchData }) => {
  const [encuestas, setEncuestas] = useState([])
  const [selectedEncuesta, setSelectedEncuesta] = useState(null)
  const [preguntas, setPreguntas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEncuestas()
  }, [])

  const loadEncuestas = async () => {
    setLoading(true)
    try {
      const encuestasData = await fetchData('/encuestas')
      setEncuestas(encuestasData)
      updateData('encuestas', encuestasData)
    } catch (error) {
      console.error('Error cargando encuestas:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPreguntas = async (encuestaId) => {
    try {
      const preguntasData = await fetchData(`/preguntas/${encuestaId}`)
      setPreguntas(preguntasData)
    } catch (error) {
      console.error('Error cargando preguntas:', error)
    }
  }

  const handleVerEncuesta = async (encuesta) => {
    setSelectedEncuesta(encuesta)
    await loadPreguntas(encuesta.id)
  }

  const handleEnviarEncuesta = async (encuesta) => {
    if (confirm(`¿Estás seguro de que quieres enviar la encuesta "${encuesta.titulo}" por WhatsApp?`)) {
      try {
        const response = await fetchData('/enviar-encuesta', {
          method: 'POST',
          body: JSON.stringify({
            encuesta_id: encuesta.id,
            fecha_envio: new Date().toISOString()
          })
        })
        
        alert('Encuesta programada para envío por WhatsApp')
      } catch (error) {
        console.error('Error enviando encuesta:', error)
        alert('Error al enviar la encuesta')
      }
    }
  }

  const handleCerrarDetalle = () => {
    setSelectedEncuesta(null)
    setPreguntas([])
  }

  if (loading) {
    return <div className="loading">Cargando encuestas...</div>
  }

  if (selectedEncuesta) {
    return (
      <div className="encuesta-detalle">
        <div className="detalle-header">
          <button onClick={handleCerrarDetalle} className="btn btn-secondary">
            ← Volver
          </button>
          <h2>{selectedEncuesta.titulo}</h2>
        </div>

        <div className="detalle-info">
          <p><strong>Curso:</strong> {selectedEncuesta.curso_nombre}</p>
          <p><strong>Docente:</strong> {selectedEncuesta.docente_nombre}</p>
          <p><strong>Sección:</strong> {selectedEncuesta.seccion_nombre}</p>
          <p><strong>Ciclo:</strong> {selectedEncuesta.ciclo_nombre}</p>
          <p><strong>Creada:</strong> {new Date(selectedEncuesta.fecha_creacion).toLocaleDateString()}</p>
        </div>

        <div className="preguntas-list">
          <h3>❓ Preguntas ({preguntas.length})</h3>
          {preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="pregunta-card">
              <div className="pregunta-header">
                <span className="pregunta-numero">Pregunta {index + 1}</span>
              </div>
              <p className="pregunta-texto">{pregunta.texto}</p>
            </div>
          ))}
        </div>

        <div className="detalle-actions">
          <button
            onClick={() => handleEnviarEncuesta(selectedEncuesta)}
            className="btn btn-primary"
          >
            📱 Enviar por WhatsApp
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="encuestas">
      <div className="page-header">
        <h2>📝 Encuestas</h2>
        <button className="btn btn-primary">
          ➕ Nueva Encuesta
        </button>
      </div>

      {encuestas.length > 0 ? (
        <div className="encuestas-grid">
          {encuestas.map(encuesta => (
            <div key={encuesta.id} className="encuesta-card">
              <div className="encuesta-header">
                <h3>{encuesta.titulo}</h3>
                <span className="encuesta-fecha">
                  {new Date(encuesta.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
              
              <div className="encuesta-info">
                <p><strong>Curso:</strong> {encuesta.curso_nombre}</p>
                <p><strong>Docente:</strong> {encuesta.docente_nombre}</p>
                <p><strong>Sección:</strong> {encuesta.seccion_nombre}</p>
              </div>
              
              <div className="encuesta-actions">
                <button
                  onClick={() => handleVerEncuesta(encuesta)}
                  className="btn btn-secondary"
                >
                  👁️ Ver Detalle
                </button>
                <button
                  onClick={() => handleEnviarEncuesta(encuesta)}
                  className="btn btn-primary"
                >
                  📱 Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No hay encuestas creadas aún.</p>
          <button className="btn btn-primary">
            ➕ Crear Primera Encuesta
          </button>
        </div>
      )}
    </div>
  )
}

export default Encuestas 