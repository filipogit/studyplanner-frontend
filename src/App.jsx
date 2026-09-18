import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask, uploadFile } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import ErrorMessage from './components/ErrorMessage'
import DeadlineReminder from './components/DeadlineReminder'
import logo from './assets/logo.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('created')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('darkMode') === 'true' } catch { return false }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    try { localStorage.setItem('darkMode', darkMode) } catch {}
  }, [darkMode])

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(task, file) {
    try {
      setError(null)
      const created = await createTask(task)
      if (file) {
        const attachment = await uploadFile(created.id, file)
        created.attachments = [attachment]
      }
      setTasks(prev => [...prev, created])
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateTask(id, task) {
    try {
      setError(null)
      await updateTask(id, task)
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task } : t))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteTask(id) {
    try {
      setError(null)
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleFileUpload(taskId, file) {
    try {
      setError(null)
      const attachment = await uploadFile(taskId, file)
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, attachments: [...(t.attachments || []), attachment] }
        }
        return t
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active' && task.isCompleted) return false
    if (filter === 'done' && !task.isCompleted) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q))
    }
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title, 'sv')
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="app">
      <div className="header-wrapper">
        <header className="header">
          <div className="header-brand">
            <img src={logo} alt="StudyPlanner" className="header-logo" />
            <div className="header-title">
              <h1>StudyPlanner</h1>
              <span className="header-tagline">Planera dina studier</span>
            </div>
          </div>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Ljust läge' : 'Mörkt läge'}
          </button>
        </header>
        <svg className="header-wave" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,0 C360,40 1080,40 1440,0 L1440,40 L0,40 Z" fill="#eef2f7" />
        </svg>
      </div>
      <main className="main">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        <DeadlineReminder tasks={tasks} />
        <TaskForm onTaskCreated={handleCreateTask} />
        <div className="search-bar">
          <input
            type="text"
            placeholder="Sök uppgifter..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="toolbar">
          <div className="filter-bar">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Alla</button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Pågående</button>
            <button className={`filter-btn ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')}>Klara</button>
          </div>
          <div className="sort-bar">
            <label htmlFor="sort">Sortera:</label>
            <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="created">Skapad (nyast först)</option>
              <option value="deadline">Deadline (närmast först)</option>
              <option value="title">Titel (A-Ö)</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Laddar uppgifter...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">{'📚'}</span>
            <p className="empty-title">Inga uppgifter ännu</p>
            <p className="empty-text">Lägg till din första studieuppgift ovan!</p>
          </div>
        ) : (
          <TaskList tasks={sortedTasks} onTaskUpdated={handleUpdateTask} onTaskDeleted={handleDeleteTask} onFileUpload={handleFileUpload} />
        )}
      </main>
      <footer className="footer">
        <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
