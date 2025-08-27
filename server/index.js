// server/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const verifyFirebaseToken = require('./verifyFirebaseToken');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
// Example protected route
app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
const userSocketMap = {};
const roomState = {};

const languageToIdMap = { javascript: 93, typescript: 94, python: 71, java: 91 };

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => ({ socketId, username: userSocketMap[socketId] })
    );
}

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, username }) => {
    if (!username) return;
    // Prevent duplicate usernames in the same room
    const clientsInRoom = getAllConnectedClients(roomId);
    const duplicate = clientsInRoom.find(client => client.username === username);
    if (duplicate) {
      socket.emit('joinError', { error: 'Username already exists in this room.' });
      return;
    }
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    if (!roomState[roomId]) {
      roomState[roomId] = { language: 'javascript', code: '// Type your code here...' };
    }

    const clients = getAllConnectedClients(roomId);
    socket.emit('joined', {
      clients, username, socketId: socket.id,
      language: roomState[roomId].language, code: roomState[roomId].code,
    });
    socket.to(roomId).emit('userJoined', { clients, username, socketId: socket.id });
  });

    socket.on('codeChange', ({ roomId, code }) => {
        if (roomState[roomId]) roomState[roomId].code = code;
        socket.to(roomId).emit('codeUpdate', { code });
    });

    socket.on('languageChange', ({ roomId, language }) => {
        if (roomState[roomId]) roomState[roomId].language = language;
        socket.to(roomId).emit('languageUpdate', { language });
    });

    socket.on('cursorChange', ({ roomId, position, selection }) => {
        socket.to(roomId).emit('cursorUpdate', { position, selection, socketId: socket.id, username: userSocketMap[socket.id] });
    });

    socket.on('mouseMove', ({ roomId, x, y }) => {
        socket.to(roomId).emit('mouseUpdate', { x, y, socketId: socket.id, username: userSocketMap[socket.id] });
    });

    socket.on('runCode', async ({ roomId, language, code, input }) => 
        {
  try {
    const language_id =
      languageToIdMap[language] ?? languageToIdMap['javascript'];

    const { data } = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
      {
        language_id,
        source_code: Buffer.from(code || '', 'utf8').toString('base64'),
        stdin: Buffer.from(input || '', 'utf8').toString('base64'),
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const decode = (v) =>
      v ? Buffer.from(v, 'base64').toString('utf8') : '';

    const stdout = decode(data.stdout);
    const stderr = decode(data.stderr);
    const compileOut = decode(data.compile_output);

    let outputText = '';
    let isError = false;

    if (compileOut) {
      outputText += `⛔ Compile Error:\n${compileOut}\n`;
      isError = true;
    }
    if (stderr) {
      outputText += `⚠️ Runtime Error:\n${stderr}\n`;
      isError = true;
    }
    if (!isError) {
      outputText = stdout || 'No output.';
    } else if (stdout) {
      outputText += `\n---\nStdout:\n${stdout}`;
    }

    io.to(roomId).emit('codeOutput', { output: outputText, error: isError });
  } catch (err) {
    io.to(roomId).emit('codeOutput', {
      output: `Server Error while running code:\n${
        err?.response?.data?.message || err.message
      }`,
      error: true,
    });
  }
});


    // NEW: Handler for chat messages
    socket.on('sendMessage', ({ roomId, message }) => {
        const messageData = {
            text: message,
            username: userSocketMap[socket.id],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        // Broadcast to all clients in the room, including the sender
        io.to(roomId).emit('receiveMessage', messageData);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                socket.to(roomId).emit('userLeft', {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            }
        });
        delete userSocketMap[socket.id];
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));