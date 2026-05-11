# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Book Shelf (Книжкова Поличка)

A web application for book exchange that allows users to share their home libraries and discover interesting reads from other community members.

## Main Idea
**Book Shelf** is a platform designed for bookcrossing. Users can list their own books, browse available literature from others, and submit exchange requests. The goal of the project is to give books a "second life" and foster an active community of readers.

## Tech Stack
* **Frontend:** React (with mobile-responsive UI design).
* **Backend:** Netlify Functions (Serverless Node.js).
* **Database:** MongoDB.
* **Deployment:** Netlify (Backend) & GitHub Pages (Frontend).


## Local Development

Follow these steps to get the project running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WebTechCNU/labs-1-4-assignment-Floratania.git
    cd labs-1-4-assignment-Floratiania
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your connection string:
    ```env
    CONNECTION_STRING=-------
    ```

4.  **Run the application:**
    Using [Netlify CLI](https://docs.netlify.com/cli/get-started/):
    ```bash
    netlify dev
    ```
    Or start the React development server:
    ```bash
    npm start
    ```

## 🌐 Deployment

https://app.netlify.com/projects/bookexchangetest/deploys

URL: https://bookexchangetest.netlify.app/

Test account:
Login - test@gmail.com
Password - 12345678!

## 📖 Key Features
* **User Authentication:** Secure login and registration.
* **Book Management:** Add new books via a modal interface with status tracking.
* **Filtering:** Search for books by genre or title.
* **Responsive Design:** Optimized for browsers.
* **Exchange System:** Manage and view exchange requests in real-time.
