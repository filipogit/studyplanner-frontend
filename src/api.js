const API_URL = 'https://localhost:7257/api';

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Kunde inte hämta uppgifter');
  return response.json();
}

export async function createTask(task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Kunde inte skapa uppgift');
  return response.json();
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Kunde inte uppdatera uppgift');
}

export async function uploadFile(taskId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/tasks/${taskId}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Kunde inte ladda upp fil');
  return response.json();
}

export function getFileUrl(taskId, fileId) {
  return `${API_URL}/tasks/${taskId}/files/${fileId}`;
}
