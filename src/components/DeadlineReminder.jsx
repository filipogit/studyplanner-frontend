import { useState } from 'react'
import './DeadlineReminder.css'

function DeadlineReminder({ tasks }) {
  const [dismissed, setDismissed] = useState([])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const reminders = tasks
    .filter(task => !task.isCompleted && task.dueDate)
    .map(task => {
      const deadline = new Date(task.dueDate)
      const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
      const diffMs = deadlineDay - today
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      return { ...task, diffDays }
    })
    .filter(task => task.diffDays <= 3 && task.diffDays >= -7)
    .filter(task => !dismissed.includes(task.id))
    .sort((a, b) => a.diffDays - b.diffDays)

  if (reminders.length === 0) return null

  function getMessage(diffDays) {
    if (diffDays < 0) return `${Math.abs(diffDays)} dag${Math.abs(diffDays) !== 1 ? 'ar' : ''} sedan deadline`
    if (diffDays === 0) return 'Deadline idag!'
    if (diffDays === 1) return 'Deadline imorgon!'
    return `${diffDays} dagar kvar till deadline`
  }

  function getType(diffDays) {
    if (diffDays < 0) return 'overdue'
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'tomorrow'
    return 'upcoming'
  }

  return (
    <div className="reminders">
      {reminders.map(task => (
        <div key={task.id} className={`reminder reminder-${getType(task.diffDays)}`}>
          <div className="reminder-content">
            <span className="reminder-icon">
              {task.diffDays < 0 ? '⚠️' : task.diffDays === 0 ? '\u{1F525}' : '⏰'}
            </span>
            <div className="reminder-text">
              <strong>{task.title}</strong>
              <span>{getMessage(task.diffDays)}</span>
            </div>
          </div>
          <button className="reminder-dismiss" onClick={() => setDismissed(prev => [...prev, task.id])}>
            {'✖'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default DeadlineReminder
