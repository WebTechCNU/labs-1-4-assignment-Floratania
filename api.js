// const API_URL = "/.netlify/functions/books";
// const AUTH_URL = "/.netlify/functions/auth";

// export const api = {
//   // Авторизація
//   login: (username) => 
//     fetch(AUTH_URL, { method: "POST", body: JSON.stringify({ username }) }).then(res => res.json()),

//   // Книги
//   getBooks: (title = '') => 
//     fetch(title ? `${API_URL}?title=${title}` : API_URL).then(res => res.json()),

//   addBook: (data) => 
//     fetch(API_URL, { method: "POST", body: JSON.stringify(data) }).then(res => res.json()),

//   deleteBook: (id) => 
//     fetch(`${API_URL}/${id}`, { method: "DELETE" }),

//   sendRequest: (id, request) => 
//     fetch(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify({ newRequest: request }) }),

//   updateBook: (id, data) => 
//     fetch(`${API_URL}/${id}`, { 
//       method: "PUT", 
//       body: JSON.stringify(data) 
//     }).then(res => res.json()),
// };

const GRAPHQL_URL = "/.netlify/functions/graphql";

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
}

export const api = {
  
  getBooks: async (filter = "") => {
    const query = `
      query GetBooks($filter: String) {
        books(filter: $filter) {
          _id
          title
          author
          status
          intent
          description
          ownerId
          ownerName
          owner
          createdAt
          requests {
            from
            text
            user
            message
            isRead
            userName
            note
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { filter });
    return data.books;
  },

  
  addBook: async (data) => {
    const mutation = `
      mutation CreateBook(
        $title: String!, 
        $author: String!,
        $status: String,
        $intent: String,
        $description: String,
        $ownerId: String,
        $ownerName: String
      ) {
        createBook(
          title: $title, 
          author: $author,
          status: $status,
          intent: $intent,
          description: $description,
          ownerId: $ownerId,
          ownerName: $ownerName
        ) {
          _id
          title
          author
        }
      }
    `;
    return await fetchGraphQL(mutation, data);
  },

 
updateBook: async (id, data) => {
  const mutation = `
    mutation UpdateBook(
      $id: ID!,
      $title: String,
      $author: String,
      $requests: [RequestInput]
    ) {
      updateBook(
        id: $id,
        title: $title,
        author: $author,
        requests: $requests
      ) {
        _id
        title
        author
        requests {
          user
          message
          isRead
          requestedAt
          userId
        }
      }
    }
  `;

  const { _id, ...updateFields } = data;

  return await fetchGraphQL(mutation, {
    id,
    ...updateFields,
  });
},


  deleteBook: async (id) => {
    const mutation = `
      mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
      }
    `;
    const data = await fetchGraphQL(mutation, { id });
    return data.deleteBook;
  },


sendBookRequest: async (bookId, requestData) => {
  const mutation = `
    mutation UpdateBook($id: ID!, $req: [RequestInput]) { # Додано [] навколо RequestInput
      updateBook(id: $id, requests: $req) {
        _id
        requests {
          user
          message
        }
      }
    }
  `;

  return await fetchGraphQL(mutation, { 
    id: bookId, 
    req: [{ 
      user: requestData.userName,
      message: requestData.note,
      isRead: false 
    }]
  });
},



  
  login: (username) => 
    fetch("/.netlify/functions/auth", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }) 
    }).then(res => res.json()),
};