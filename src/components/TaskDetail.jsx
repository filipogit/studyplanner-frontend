import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getTasks, updateTask, deleteTask, uploadFile, getFileUrl } from '../api'
import './TaskDetail.css'

const categoryColors = [
  { bg: '#e8f0fe', color: '#1a73e8' },
  { bg: '#fce8e8', color: '#c62828' },
  { bg: '#e8f5e9', color: '#2e7d32' },
  { bg: '#fff3e0', color: '#e65100' },
  { bg: '#f3e5f5', color: '#7b1fa2' },
  { bg: '#e0f7fa', color: '#00838f' },
]

function getCategoryColor(category) {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return categoryColors[Math.abs(hash) % categoryColors.length]
}

function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadTask()
  }, [id])

  async function loadTask() {
    try {
      setLoading(true)
      const tasks = await getTasks()
      const found = tasks.find(t => t.id === parseInt(id))
      if (!found) {
        setError('Uppgiften hittades inte')
      } else {
        setTask(found)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEditing() {
    setEditing(true)
    setEditForm({
      title: task.title,
      description: task.description || '',
      category: task.category || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    })
  }

  async function handleSave() {
    try {
      await updateTask(task.id, {
        ...task,
        title: editForm.title,
        description: editForm.description || null,
        category: editForm.category || null,
        dueDate: editForm.dueDate || null,
      })
      setTask(prev => ({
        ...prev,
        title: editForm.title,
        description: editForm.description || null,
        category: editForm.category || null,
        dueDate: editForm.dueDate || null,
      }))
      setEditing(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggleStatus() {
    const msg = task.isCompleted
      ? 'Vill du markera uppgiften som pågående igen?'
      : 'Vill du markera uppgiften som klar?'
    if (!window.confirm(msg)) return

    try {
      await updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
      setTask(prev => ({ ...prev, isCompleted: !prev.isCompleted }))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Vill du ta bort denna uppgift?')) return
    try {
      await deleteTask(task.id)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const attachment = await uploadFile(task.id, file)
      setTask(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), attachment],
      }))
    } catch (err) {
      setError(err.message)
    }
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="detail-container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Laddar uppgift...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="detail-container">
        <div className="detail-error">
          <p>{error || 'Uppgiften hittades inte'}</p>
          <Link to="/" className="back-link">Tillbaka till startsidan</Link>
        </div>
      </div>
    )
  }

  const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">{'< Tillbaka'}</Link>

      <div className={`detail-card ${task.isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
        {editing ? (
          <div className="detail-edit">
            <div className="form-group">
              <label>Titel</label>
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Beskrivning</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="detail-edit-row">
              <div className="form-group">
                <label>Ämne/kurs</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="detail-edit-actions">
              <button className="save-btn" onClick={handleSave}>Spara</button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>Avbryt</button>
            </div>
          </div>
        ) : (
          <>
            <div className="detail-header">
              <h2 className="detail-title">{task.title}</h2>
              <button
                className={`status-btn ${task.isCompleted ? 'done' : 'pending'}`}
                onClick={handleToggleStatus}
              >
                {task.isCompleted ? 'Klar' : 'Pågående'}
              </button>
            </div>

            {task.category && (
              <span
                className="detail-category"
                style={{
                  backgroundColor: getCategoryColor(task.category).bg,
                  color: getCategoryColor(task.category).color,
                }}
              >
                {task.category}
              </span>
            )}

            {task.description && (
              <div className="detail-section">
                <h3>Beskrivning</h3>
                <p>{task.description}</p>
              </div>
            )}

            <div className="detail-meta">
              {task.dueDate && (
                <div className={`detail-meta-item ${isOverdue ? 'overdue-text' : ''}`}>
                  <span className="meta-label">Deadline</span>
                  <span>{new Date(task.dueDate).toLocaleDateString('sv-SE')}</span>
                </div>
              )}
              <div className="detail-meta-item">
                <span className="meta-label">Skapad</span>
                <span>{new Date(task.createdAt).toLocaleDateString('sv-SE')}</span>
              </div>
            </div>

            {task.attachments && task.attachments.length > 0 && (
              <div className="detail-section">
                <h3>Bifogade filer</h3>
                <div className="detail-files">
                  {task.attachments.map(file => {
                    const isImage = file.contentType && file.contentType.startsWith('image/')
                    return isImage ? (
                      <a key={file.id} href={getFileUrl(task.id, file.id)} target="_blank" rel="noopener noreferrer">
                        <img src={getFileUrl(task.id, file.id)} alt={file.fileName} className="detail-image" />
                      </a>
                    ) : (
                      <a
                        key={file.id}
                        href={getFileUrl(task.id, file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        {'\u{1F4C4}'} {file.fileName}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button className="edit-btn" onClick={startEditing}>Redigera</button>
              <button className="upload-btn" onClick={() => fileInputRef.current.click()}>Ladda upp fil</button>
              <button className="delete-btn" onClick={handleDelete}>Ta bort</button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TaskDetail
