const WebSocket = require('ws');
const EventEmitter = require('events');

let sensorData = { ir: null, red: null };
let heartRateData = { bpm: null, avgBpm: null };
let temperatureData = { temperatureC: null, temperatureF: null };
let oxygenData = { SpO2: null };
let wsClient = null;

const dataEmitter = new EventEmitter();

const handleSensorData = (data) => {
    sensorData = data;
    console.log('Sensor data processed:', sensorData);
};

const handleHeartRateData = (data) => {
    heartRateData = data;
    console.log('Heart rate data processed:', heartRateData);
};

const handleTemperatureData = (data) => {
    temperatureData = data;
    console.log('Temperature data processed:', temperatureData);
};

const handleOxygenData = (data) => {
    oxygenData = data;
    console.log('Oxygen data processed:', oxygenData);
};

// Register event listeners
dataEmitter.on('sensor', handleSensorData);
dataEmitter.on('heartRate', handleHeartRateData);
dataEmitter.on('temperature', handleTemperatureData);
dataEmitter.on('SpO2', handleOxygenData);

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    wsClient = ws; // Guardar la conexión WebSocket del ESP32

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message); // Parsear los datos recibidos
            dataEmitter.emit(data.type, data); // Emitir evento basado en el tipo de dato
            console.log('Datos recibidos:', data);
        } catch (error) {
            console.error('Error al parsear los datos:', error);
        }
    });

    ws.send('Conexión establecida con el servidor WebSocket');
});

const getSensorData = () => sensorData;
const getHeartRateData = () => heartRateData;
const getTemperatureData = () => temperatureData;
const getOxygenData = () => oxygenData;
const getWsClient = () => wsClient;

module.exports = {
    wss,
    getSensorData,
    getHeartRateData,
    getTemperatureData,
    getOxygenData,
    getWsClient
};