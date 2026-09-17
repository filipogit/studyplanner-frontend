import { useState } from 'react'
import './TaskList.css'

function TaskList({ tasks, onTaskUpdated }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  function startEditing(task) {
    setEditingId(task.id)
    setEditForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      isCompleted: task.isCompleted,
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({})
  }

  function handleSave(task) {
    onTaskUpdated(task.id, {
      ...task,
      title: editForm.title,
      description: editForm.description || null,
      dueDate: editForm.dueDate || null,
      isCompleted: editForm.isCompleted,
    })
    setEditingId(null)
  }

  if (tasks.length === 0) {
    return <p className="empty-message">Inga uppgifter ännu. Lägg till en!</p>
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
          {editingId === task.id ? (
            <div className="edit-form">
              <div className="form-group">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editForm.isCompleted}
                  onChange={e => setEditForm({ ...editForm, isCompleted: e.target.checked })}
                />
                Klar
              </label>
              <div className="edit-actions">
                <button className="save-btn" onClick={() => handleSave(task)}>Spara</button>
                <button className="cancel-btn" onClick={cancelEditing}>Avbryt</button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-info">
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-description">{task.description}</p>}
                {task.dueDate && (
                  <p className="task-due">Deadline: {new Date(task.dueDate).toLocaleDateString('sv-SE')}</p>
                )}
              </div>
              <div className="task-actions">
                <span className={`task-status ${task.isCompleted ? 'done' : 'pending'}`}>
                  {task.isCompleted ? 'Klar' : 'Pågående'}
                </span>
                <button className="edit-btn" onClick={() => startEditing(task)}>Redigera</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TaskList
