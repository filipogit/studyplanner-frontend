import { useState, useRef } from 'react'
import { getFileUrl } from '../api'
import './TaskList.css'

const categoryColors = [
  { bg: '#e8f0fe', color: '#1a73e8', dark: '#1a3a5c', darkColor: '#5fa8ff' },
  { bg: '#fce8e8', color: '#c62828', dark: '#5c1a1a', darkColor: '#ff7b7b' },
  { bg: '#e8f5e9', color: '#2e7d32', dark: '#1a3d1e', darkColor: '#66bb6a' },
  { bg: '#fff3e0', color: '#e65100', dark: '#4a2800', darkColor: '#ffb74d' },
  { bg: '#f3e5f5', color: '#7b1fa2', dark: '#3a1a4a', darkColor: '#ce93d8' },
  { bg: '#e0f7fa', color: '#00838f', dark: '#1a3a3d', darkColor: '#4dd0e1' },
]

function getCategoryColor(category) {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return categoryColors[Math.abs(hash) % categoryColors.length]
}

function TaskList({ tasks, onTaskUpdated, onFileUpload }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const fileInputRef = useRef(null)
  const [uploadTaskId, setUploadTaskId] = useState(null)

  function startEditing(task) {
    setEditingId(task.id)
    setEditForm({
      title: task.title,
      description: task.description || '',
      category: task.category || '',
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
      category: editForm.category || null,
      dueDate: editForm.dueDate || null,
      isCompleted: editForm.isCompleted,
    })
    setEditingId(null)
  }

  function handleUploadClick(taskId) {
    setUploadTaskId(taskId)
    fileInputRef.current.click()
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file && uploadTaskId) {
      onFileUpload(uploadTaskId, file)
    }
    e.target.value = ''
    setUploadTaskId(null)
  }

  if (tasks.length === 0) {
    return <p className="empty-message">Inga uppgifter ännu. Lägg till en!</p>
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''} ${!task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
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
                    type="text"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="Ämne/kurs"
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
                  <button className="save-btn" onClick={() => handleSave(task)}>{'✔️'} Spara</button>
                  <button className="cancel-btn" onClick={cancelEditing}>{'✖️'} Avbryt</button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-info">
                  <h3 className="task-title">{task.title}</h3>
                  {task.category && (
                    <span
                      className="task-category"
                      style={{
                        backgroundColor: getCategoryColor(task.category).bg,
                        color: getCategoryColor(task.category).color,
                      }}
                    >
                      {task.category}
                    </span>
                  )}
                  {task.description && <p className="task-description">{task.description}</p>}
                  {task.dueDate && (
                    <p className="task-due">{'\u{1F4C5}'} {new Date(task.dueDate).toLocaleDateString('sv-SE')}</p>
                  )}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="task-files">
                      {task.attachments.map(file => (
                        <a
                          key={file.id}
                          href={getFileUrl(task.id, file.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          {'\u{1F4C4}'} {file.fileName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className={`status-btn ${task.isCompleted ? 'done' : 'pending'}`}
                    onClick={() => {
                      const msg = task.isCompleted
                        ? 'Vill du markera uppgiften som pågående igen?'
                        : 'Vill du markera uppgiften som klar?'
                      if (window.confirm(msg)) {
                        onTaskUpdated(task.id, { ...task, isCompleted: !task.isCompleted })
                      }
                    }}
                  >
                    {task.isCompleted ? '✅ Klar' : '⏳ Pågående'}
                  </button>
                  <button className="edit-btn" onClick={() => startEditing(task)}>{'✏️'} Redigera</button>
                  <button className="upload-btn" onClick={() => handleUploadClick(task.id)}>{'\u{1F4CE}'} Ladda upp fil</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default TaskList
