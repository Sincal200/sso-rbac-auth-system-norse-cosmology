const express = require('express');
const router = express.Router();
const cors = require('cors');
const addUserMiddleware = require('../middlewares/addUserMiddleware');
const { create, test, getAll, startTemperature, stopTemperature, 
  startSensorData, stopSensorData, sensorData, sensorTemperature, 
  sensorOxygen, startOxygen, stopOxygen, startHeartRate, 
  stopHeartRate, sensorHeartRate, getAllOxygen, 
  createOxygen, storeSessionToken, checkSession, login,
  updateUsername, createDevice, getDevice,
  createHeartRate, getAllHeartRate, getAverageTemperature,
  storeDeviceId, getDeviceId, getAverageOxygen, getAverageHeartRate,
  authenticate} = require('../controllers/dataController');

const allowedOrigins = [
  'http://64.227.110.203:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

router.use(cors(corsOptions));

router.post('/temperatures',addUserMiddleware , create);
router.post('/oxygen',addUserMiddleware ,createOxygen);
router.get('/', test);
router.get('/getTemperatures', getAll);
router.get('/getOxygen', getAllOxygen);

router.get('/sensor-data', sensorData);
router.post('/start-temperature', startTemperature);
router.post('/stop-temperature', stopTemperature);
router.post('/start-sending', startSensorData);
router.post('/stop-sending', stopSensorData);
router.get('/sensor-temperature', sensorTemperature);
router.post('/start-oxygen', startOxygen);
router.post('/stop-oxygen', stopOxygen);
router.get('/sensor-oxygen', sensorOxygen);
router.post('/start-heart-rate', startHeartRate);
router.post('/stop-heart-rate', stopHeartRate);
router.get('/sensor-heart-rate', sensorHeartRate);
router.get('/check-session', checkSession);
router.post('/device', createDevice);
router.get('/getDevice', getDevice);
router.post('/heart-rate',addUserMiddleware ,createHeartRate);
router.get('/getHeartRate', getAllHeartRate);
router.get('/average-temperature', getAverageTemperature);

// Nuevo endpoint para almacenar el refreshToken en la sesión
router.post('/store-session-token', storeSessionToken);
router.post('/login', login);

// Nuevo endpoint para actualizar el nombre de usuario global
router.post('/update-username', updateUsername);

// Nuevos endpoints para almacenar y recuperar el ID del dispositivo
router.post('/store-device-id', storeDeviceId);
router.get('/get-device-id', getDeviceId);

router.get('/average-oxygen', getAverageOxygen);

router.get('/average-heart-rate', getAverageHeartRate);

//keycloak
router.get('/authenticate', authenticate);

module.exports = router;