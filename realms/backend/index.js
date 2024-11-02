const express = require('express');
const { mongoose } = require('mongoose');
const dotenv = require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const { wss } = require('./handlers/webSocketHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const redis = require('ioredis');

const app = express();

// Configurar Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

redisClient.on('end', () => {
  console.log('Redis client connection closed');
});

// Configurar el middleware de sesión
app.use(session({
  secret: 'your_secret_key', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

app.use(cookieParser());

// Middleware de autenticación
app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userDataString = await redisClient.get(token);
    if (userDataString) {
      req.user = JSON.parse(userDataString);
      next();
    } else {
      res.status(401).send('Invalid or expired user key');
    }
  } catch (err) {
    res.status(401).send('Authentication failed');
  }
});

// Middleware de autorización
const authorizationMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const availableRoles = req.user.realm_access.roles;
      if (!availableRoles.includes(requiredRole)) throw new Error();
      next();
    } catch (err) {
      res.status(403).send({ error: 'access denied' });
    }
  };
};

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
server.listen(port, () => {
  console.log(`Asgard listening on port ${port}`);
});
