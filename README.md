# 🚀 Live Code Collab

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg) ![Tech Stack](https://img.shields.io/badge/Stack-MERN+Socket.io-green)

A real-time, full-stack collaborative code editor built to facilitate seamless pair-programming and remote technical interviews. The application enables multiple users to join a shared room, write and run code, and communicate via a live chat—all synchronized in real-time.



### Key Features

- **⚡ Real-Time Editing:** Synchronized code editing for all users in a room using the powerful Monaco Editor.
- **👀 Remote Cursor Tracking:** See your collaborators' cursors and text selections as they happen.
- **▶️ Shared Code Execution:** A shared I/O terminal to run code and see the same output, powered by the Judge0 API.
- **🌐 Multi-Language Support:** Natively supports JavaScript, TypeScript, Python, and Java.
- **💬 Integrated Live Chat:** A slide-out overlay panel for real-time communication between participants.
- **🔐 Secure User Authentication:** User sign-up and login handled by Firebase Authentication.
- **✨ Modern & Dynamic UI:** A responsive, fully resizable interface built with Tailwind CSS for a clean, VS Code-like experience.

---

### Tech Stack

This project was built as a full-stack application with a separate client and server architecture.

* **Frontend:**
    * React.js (Hooks, Context API)
    * Tailwind CSS
    * Monaco Editor
    * `react-resizable` for dynamic layouts

* **Backend:**
    * Node.js
    * Express.js

* **Real-Time Communication:**
    * Socket.io (WebSockets)

* **Authentication & APIs:**
    * Firebase Authentication
    * Judge0 REST API

* **Deployment:**
    * **Client:** Vercel / Netlify
    * **Server:** Render

---
