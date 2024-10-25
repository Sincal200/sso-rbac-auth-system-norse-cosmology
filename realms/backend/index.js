const express = require('express');
const { mongoose } = require('mongoose');
const dotenv = require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const { wss } = require('./handlers/webSocketHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Importar cookie-parser


const app = express();

// Configurar el middleware de sesión
app.use(session({
  secret: 'your_secret_key', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

app.use(cookieParser());



mongoose.connect(process.env.MONGO_URL, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Database not connected', err));

app.use(express.json());
app.use('/', require('./routes/dataRoutes'));



const server = http.createServer(app);

// Integrar WebSocket Server con el servidor HTTP
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Asgard listening on port ${port}`);
});
