import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, uploadFile } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import ErrorMessage from './components/ErrorMessage'
import logo from './assets/logo.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('created')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
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

  async function handleCreateTask(task) {
    try {
      setError(null)
      const created = await createTask(task)
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
      <header className="header">
        <div className="header-brand">
          <img src={logo} alt="StudyPlanner" className="header-logo" />
          <h1>StudyPlanner</h1>
        </div>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Ljust läge' : 'Mörkt läge'}
        </button>
      </header>
      <main className="main">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
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
        ) : (
          <TaskList tasks={sortedTasks} onTaskUpdated={handleUpdateTask} onFileUpload={handleFileUpload} />
        )}
      </main>
    </div>
  )
}

export default App
