import { useState, useEffect } from 'react'
import { getTasks } from './api'
import TaskList from './components/TaskList'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>StudyPlanner</h1>
      </header>
      <main className="main">
        <TaskList tasks={tasks} />
      </main>
    </div>
  )
}

export default App
