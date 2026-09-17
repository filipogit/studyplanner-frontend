import './TaskList.css'

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-message">Inga uppgifter ännu. Lägg till en!</p>
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}
            {task.dueDate && (
              <p className="task-due">Deadline: {new Date(task.dueDate).toLocaleDateString('sv-SE')}</p>
            )}
          </div>
          <span className={`task-status ${task.isCompleted ? 'done' : 'pending'}`}>
            {task.isCompleted ? 'Klar' : 'Pågående'}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
