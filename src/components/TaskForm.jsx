import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Titel är obligatoriskt'
    } else if (title.trim().length > 200) {
      newErrors.title = 'Titel får max vara 200 tecken'
    }
    if (description.length > 1000) {
      newErrors.description = 'Beskrivning får max vara 1000 tecken'
    }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onTaskCreated({
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      category: category.trim() || null,
      isCompleted: false,
    })

    setTitle('')
    setDescription('')
    setDueDate('')
    setCategory('')
    setErrors({})
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Ny uppgift</h2>
      <div className="form-fields">
        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ange uppgiftens titel"
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">
            Beskrivning
            <span className="char-count">{description.length}/1000</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Valfri beskrivning"
            rows={3}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="category">Ämne/kurs</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="T.ex. Matematik, Engelska"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Deadline</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="submit-btn">Lägg till</button>
    </form>
  )
}

export default TaskForm
