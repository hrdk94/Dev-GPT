DevGPT — AI Developer Assistant

A full-stack AI developer assistant built with React, Node.js, Express.js, MongoDB, and Google Gemini.

DevGPT provides a ChatGPT-style developer experience with authenticated users, persistent conversations, Markdown/code rendering, response regeneration, and conversation management.

🚀 Live Demo

Open DevGPT

✨ Features

JWT-based authentication

User registration and login

Password hashing with bcrypt

Persistent AI conversations

Multiple conversations per user

Conversation history

Delete conversations

Regenerate AI responses

Markdown rendering with GitHub-Flavored Markdown

Code blocks with copy functionality

Auto-resizing chat input

Responsive dark UI

Automatic logout when JWT expires

Google Gemini AI integration

🛠️ Tech Stack

Frontend

React

Vite

React Router

Axios

React Markdown

Remark GFM

Lucide React

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Google Gemini API

🏗️ Architecture

React + Vite
     │
     │ Axios / REST API
     ▼
Node.js + Express
     │
     ├── JWT Authentication
     │
     ├── MongoDB + Mongoose
     │
     └── Google Gemini API

🔐 Authentication Flow

User registers or logs in.

The backend validates the credentials.

Passwords are hashed and verified using bcrypt.

The backend generates a JWT.

The frontend stores the token.

Axios attaches the JWT to protected API requests.

Express middleware verifies the token.

The authenticated user's ID is used to access their conversations.

🤖 AI Request Flow

User Message
     │
     ▼
React Frontend
     │
     ▼
POST /api/chat
     │
     ▼
JWT Middleware
     │
     ▼
Conversation Lookup / Creation
     │
     ▼
Conversation History
     │
     ▼
Google Gemini
     │
     ▼
AI Response
     │
     ├──────────► MongoDB
     │
     ▼
Express Response
     │
     ▼
React Markdown Renderer

The application currently uses Gemini 3.1 Flash-Lite for AI responses.

📡 API Endpoints

Authentication

Method

Endpoint

Description

POST

/api/auth/register

Register a new user

POST

/api/auth/login

Login and receive a JWT

GET

/api/auth/me

Get the authenticated user

Chat

Method

Endpoint

Description

POST

/api/chat

Send a message and generate an AI response

GET

/api/chat

Get the user's conversations

GET

/api/chat/:id

Get a specific conversation

POST

/api/chat/:id/regenerate

Regenerate the latest AI response

DELETE

/api/chat/:id

Delete a conversation

📁 Project Structure

Dev-GPT/
│
├── Backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   ├── utils/
│   │   └── ai.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWindow.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md

⚙️ Environment Variables

Backend

Create Backend/.env:

PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173

Frontend

Create Frontend/.env:

VITE_API_URL=http://localhost:8080/api

Never commit .env files or API keys to the repository.

🚀 Run Locally

Backend

cd Backend
npm install
npm run dev

Frontend

Open another terminal:

cd Frontend
npm install
npm run dev

The local application runs on:

Frontend: http://localhost:5173
Backend:  http://localhost:8080

☁️ Deployment

The application is deployed using Render.

Frontend: Render Static Site

Backend: Render Web Service

Database: MongoDB Atlas

AI: Google Gemini API

Production URLs

Frontend: https://devgpt-eu7l.onrender.com

Backend: https://devgpt-backend-2m2q.onrender.com

🔒 Security

Passwords are hashed using bcrypt.

JWT authentication protects private API routes.

Users can only access their own conversations.

Environment variables are excluded from Git.

Expired JWTs automatically log users out.

🔮 Future Improvements

Streaming AI responses

Conversation search

Conversation renaming

Message editing

File upload and document analysis

Multiple AI model support

Code execution sandbox

Voice input

Rate limiting

Production-grade CORS configuration

👨‍💻 Author

Hardik Goyal

B.Tech Computer Science & Engineering
DIT University

Built as a full-stack project to explore authentication, REST APIs, database persistence, AI integration, and modern React development.
