import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, uploadFile } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('created')

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
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

  const sortedTasks = [...tasks].sort((a, b) => {
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
        <h1>StudyPlanner</h1>
      </header>
      <main className="main">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        <TaskForm onTaskCreated={handleCreateTask} />
        <div className="sort-bar">
          <label htmlFor="sort">Sortera efter:</label>
          <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="created">Skapad (nyast först)</option>
            <option value="deadline">Deadline (närmast först)</option>
            <option value="title">Titel (A-Ö)</option>
          </select>
        </div>
        <TaskList tasks={sortedTasks} onTaskUpdated={handleUpdateTask} onFileUpload={handleFileUpload} />
      </main>
    </div>
  )
}

export default App
