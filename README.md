# DevGPT — AI Developer Assistant

DevGPT is a full-stack AI developer assistant built with **React, Node.js, Express.js, MongoDB, and Google Gemini**.

The application provides an authenticated ChatGPT-style experience with persistent conversations, Markdown and code rendering, conversation management, response regeneration, and a responsive interface.

---

## ✨ Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- 🔒 Password hashing with bcrypt
- 💬 Persistent AI conversations
- 🗂️ Multiple conversations per user
- 🕘 Conversation history
- 🗑️ Delete conversations
- 🔄 Regenerate AI responses
- 📝 Markdown rendering
- 💻 Syntax-friendly code blocks
- 📋 Copy code functionality
- ✍️ Auto-resizing chat input
- 📱 Responsive chat interface
- 🌙 Dark-themed UI
- 🤖 Google Gemini AI integration
- ⏱️ Automatic logout when JWT expires

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- React Markdown
- Remark GFM
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Google Gemini API

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                         Axios / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │    JWT     │   │  MongoDB   │   │   Gemini   │
       │    Auth    │   │  Database  │   │    API     │
       └────────────┘   └────────────┘   └────────────┘
🤖 AI Conversation Flow
User
 │
 ▼
Register / Login
 │
 ▼
Express API
 │
 ├── bcrypt → Password verification
 │
 └── JWT → Authentication token
              │
              ▼
        React stores token
              │
              ▼
       Axios attaches token
              │
              ▼
      Protected API routes
              │
              ▼
       JWT middleware
              │
              ▼
        Authenticated user


🚀 Running Locally
1. Clone the repository
git clone https://github.com/hrdk94/Dev-GPT.git
cd Dev-GPT
2. Install backend dependencies
cd Backend
npm install
3. Configure backend environment variables

Create:

Backend/.env

and add the required MongoDB, JWT, and Gemini credentials.

4. Start the backend
npm run dev

The backend will run on:

http://localhost:8080
5. Install frontend dependencies

Open another terminal:

cd Frontend
npm install
6. Configure frontend environment variables

Create:

Frontend/.env

with:

VITE_API_URL=http://localhost:8080/api
7. Start the frontend
npm run dev

The frontend will be available at:

http://localhost:5173
