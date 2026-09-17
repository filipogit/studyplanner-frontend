import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  async function handleCreateTask(task) {
    const created = await createTask(task)
    setTasks(prev => [...prev, created])
  }

  async function handleUpdateTask(id, task) {
    await updateTask(id, task)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task } : t))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>StudyPlanner</h1>
      </header>
      <main className="main">
        <TaskForm onTaskCreated={handleCreateTask} />
        <TaskList tasks={tasks} onTaskUpdated={handleUpdateTask} />
      </main>
    </div>
  )
}

export default App
