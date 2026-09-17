import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    onTaskCreated({
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      isCompleted: false,
    })

    setTitle('')
    setDescription('')
    setDueDate('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Ny uppgift</h2>
      <div className="form-group">
        <label htmlFor="title">Titel *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ange uppgiftens titel"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Beskrivning</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Valfri beskrivning"
          rows={3}
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
      <button type="submit" className="submit-btn">Lägg till</button>
    </form>
  )
}

export default TaskForm
