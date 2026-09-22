# ⚡ DevGPT

### AI Developer Assistant

A full-stack AI chat application built with **React, Node.js, Express, MongoDB, and Google Gemini**.

🔗 **[Live Demo](https://devgpt-eu7l.onrender.com/login)**

---

## ✨ Features

- 🔐 JWT authentication
- 💬 Persistent conversations
- 🤖 Gemini AI integration
- 📝 Markdown & code rendering
- 📋 Copy code blocks
- 🔄 Regenerate responses
- 🗑️ Delete conversations
- 📱 Responsive UI
- ⏱️ Automatic JWT expiry logout

---

## 🛠️ Tech Stack

**Frontend**
`React` `Vite` `Axios` `React Router` `React Markdown`

**Backend**
`Node.js` `Express.js` `MongoDB` `Mongoose` `JWT` `bcrypt`

**AI**
`Google Gemini API`

---

## 🏗️ Architecture

```text
┌──────────────┐
│ React + Vite │
└──────┬───────┘
       │ REST API
       ▼
┌──────────────────┐
│ Node + Express   │
├──────────────────┤
│ JWT Auth         │
│ Chat API         │
└──────┬───────┬───┘
       │       │
       ▼       ▼
   MongoDB   Gemini

RUN LOCALLY
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev

👨‍💻 Author

Hardik Goyal
B.Tech CSE — DIT University

⭐ If you find the project interesting, consider starring the repository!



This is much better for your GitHub IMO — **quick scan, live demo immediately visible, tech stack obvious, architecture visible, no giant wall of text.**
