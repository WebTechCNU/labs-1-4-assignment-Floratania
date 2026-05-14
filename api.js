const GRAPHQL_URL = "/.netlify/functions/graphql";


async function fetchGraphQL(query, variables = {}) {
  let token = localStorage.getItem("token");
  
  if (token) {
    
    token = token.replace(/['"]+/g, '').trim().replace(/[\n\r]/g, "");
  }

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Server Error:", result);
    throw new Error("Server error");
  }

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error(result.errors[0].message);
  }

  return result.data;
}


export const api = {
  login: async (email, password) => {
    const response = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, isLogin: true }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    if (data.token) {
      const cleanToken = data.token.replace(/^"|"$/g, '').trim();
      localStorage.setItem("token", cleanToken);
    }
    return data;
  },

  register: async (userData) => {
    const response = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, isLogin: false }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (data.token) localStorage.setItem("token", data.token.trim());
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("book_user");
  },


  getBooks: async (filter = "") => {
    const query = `
      query GetBooks($filter: String) {
        books(filter: $filter) {
          _id title author status intent description ownerId ownerName createdAt
          requests { user message isRead requestedAt userId }
        }
      }
    `;
    const data = await fetchGraphQL(query, { filter });
    return data.books;
  },

  myBooks: async () => {
    const query = `
      query {
        myBooks { _id title author status intent description ownerId ownerName createdAt }
      }
    `;
    const data = await fetchGraphQL(query);
    return data.myBooks;
  },

  addBook: async (bookData) => {
    const mutation = `
      mutation CreateBook($title: String!, $author: String!, $status: String, $intent: String, $description: String) {
        createBook(title: $title, author: $author, status: $status, intent: $intent, description: $description) {
          _id title author ownerId ownerName
        }
      }
    `;
    return await fetchGraphQL(mutation, bookData);
  },

  
  updateBook: async (id, updateData) => {
    const mutation = `
      mutation UpdateBook($id: ID!, $title: String, $author: String, $status: String, $intent: String, $description: String) {
        updateBook(id: $id, title: $title, author: $author, status: $status, intent: $intent, description: $description) {
          _id title author status intent description
        }
      }
    `;
    return await fetchGraphQL(mutation, { id, ...updateData });
  },

  deleteBook: async (id) => {
    const mutation = `mutation DeleteBook($id: ID!) { deleteBook(id: $id) }`;
    const data = await fetchGraphQL(mutation, { id });
    return data.deleteBook;
  },

  markRequestAsRead: async (bookId, requestIndex) => {
    const mutation = `
      mutation MarkRequestAsRead($bookId: ID!, $requestIndex: Int!) {
        markRequestAsRead(bookId: $bookId, requestIndex: $requestIndex) {
          _id
          requests { user message isRead requestedAt userId }
        }
      }
    `;
    return await fetchGraphQL(mutation, { bookId, requestIndex });
  },

  sendBookRequest: async (bookId, requestData) => {
    const mutation = `
      mutation UpdateBook($id: ID!, $requests: [RequestInput]) {
        updateBook(id: $id, requests: $requests) {
          _id
          requests { user message isRead requestedAt userId }
        }
      }
    `;
    return await fetchGraphQL(mutation, {
      id: bookId,
      requests: [{ message: requestData.note }],
    });
  },
};  