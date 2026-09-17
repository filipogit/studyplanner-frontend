const API_URL = 'https://localhost:5001/api';

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
