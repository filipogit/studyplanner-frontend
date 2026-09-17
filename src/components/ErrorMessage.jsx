import './ErrorMessage.css'

function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onClose} className="error-close">&times;</button>
    </div>
  )
}

export default ErrorMessage
