import { useState, useEffect } from 'react'
import { getTasks, createTask } from './api'
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

  return (
    <div className="app">
      <header className="header">
        <h1>StudyPlanner</h1>
      </header>
      <main className="main">
        <TaskForm onTaskCreated={handleCreateTask} />
        <TaskList tasks={tasks} />
      </main>
    </div>
  )
}

export default App
