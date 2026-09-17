import { useState, useRef } from 'react'
import { getFileUrl } from '../api'
import './TaskList.css'

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
                          {file.fileName}
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
                    {task.isCompleted ? 'Klar' : 'Pågående'}
                  </button>
                  <button className="edit-btn" onClick={() => startEditing(task)}>Redigera</button>
                  <button className="upload-btn" onClick={() => handleUploadClick(task.id)}>Ladda upp fil</button>
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
