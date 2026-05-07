const API_URL = "/.netlify/functions/books";
const AUTH_URL = "/.netlify/functions/auth";

export const api = {
  // Авторизація
  login: (username) => 
    fetch(AUTH_URL, { method: "POST", body: JSON.stringify({ username }) }).then(res => res.json()),

  // Книги
  getBooks: (title = '') => 
    fetch(title ? `${API_URL}?title=${title}` : API_URL).then(res => res.json()),

  addBook: (data) => 
    fetch(API_URL, { method: "POST", body: JSON.stringify(data) }).then(res => res.json()),

  deleteBook: (id) => 
    fetch(`${API_URL}/${id}`, { method: "DELETE" }),

  sendRequest: (id, request) => 
    fetch(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify({ newRequest: request }) }),

  updateBook: (id, data) => 
    fetch(`${API_URL}/${id}`, { 
      method: "PUT", 
      body: JSON.stringify(data) 
    }).then(res => res.json()),
};