// Simple API client for boards CRUD
// Base URL: http://localhost:3000

const BASE_URL = 'http://127.0.0.1:3000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  // Try to parse JSON; if no body, just return null
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const error = new Error('API Error');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getBoards() {
  return request('/boards', {
    method: 'GET',
  });
}

export function getBoard(id) {
  return request(`/boards/${id}`, {
    method: 'GET',
  });
}

export function createBoard(body) {
  return request('/boards', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateBoard(id, body) {
  return request(`/boards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteBoard(id) {
  return request(`/boards/${id}`, {
    method: 'DELETE',
  });
}


