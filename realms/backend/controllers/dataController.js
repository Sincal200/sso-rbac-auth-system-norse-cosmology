const { getUsername } = require('../middlewares/globalUsername');
const dataService = require('../services/dataService');
const { getSensorData, getHeartRateData, getTemperatureData, 
    getWsClient, getOxygenData} = require('../handlers/webSocketHandler');
const WebSocket = require('ws');
const { setUsername } = require('../middlewares/globalUsername');

let deviceId = null; // Variable para almacenar el ID del dispositivo

const storeDeviceId = (req, res) => {
    deviceId = req.body.deviceId;
    res.status(200).send('Device ID stored successfully');
};

const getDeviceId = (req, res) => {
    if (!deviceId) {
        return res.status(404).send('No device ID found');
    }
    res.status(200).json({ deviceId });
};

const test = (req, res) => {
    res.json('Hello from the server!');
}

const getAll  = async (req, res) => {
    const temperatures = await dataService.getAll();
    res.json(temperatures);
}

const create = async (req, res) => {
    const temperature = req.body;
    const newTemperature = await dataService.create(temperature);
    res.json(newTemperature);
}

const createOxygen = async (req, res) => {
    const oxygen = req.body;
    const newOxygen = await dataService.createOxygen(oxygen);
    res.json(newOxygen);
}

const getAllOxygen = async (req, res) => {
    const oxygen = await dataService.getAllOxygen();
    res.json(oxygen);
}


const sensorData = async (req, res) => {
    res.json(getSensorData());
}

const sensorTemperature = async (req, res) => {
    res.json(getTemperatureData());
}

const sensorOxygen = async (req, res) => {
    res.json(getOxygenData());
}

const sensorHeartRate = async (req, res) => {
    res.json(getHeartRateData());
}

const createDevice = async (req, res) => {
    const device = req.body;
    const newDevice = await dataService.createDevice(device);
    res.json(newDevice);
}

const getDevice = async (req, res) => {
    const device = await dataService.getDevice();
    res.json(device);
}

const createHeartRate = async (req, res) => {
    const heartRate = req.body;
    const newHeartRate = await dataService.createHeartData(heartRate);
    res.json(newHeartRate);
}

const getAllHeartRate = async (req, res) => {
    const heartRate = await dataService.getHeartData();
    res.json(heartRate);
}

const getAverageTemperature = async (req, res) => {
    const userId = getUsername();; // Obtener el userId de los parámetros de la consulta
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        const averageTemperatures = await dataService.getAverageTemperature(userId);
        res.json(averageTemperatures);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching average temperature' });
    }
}

const startSensorData = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('START');
        res.json({ message: 'Señal de inicio enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
};

const stopSensorData = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('STOP');
        res.json({ message: 'Señal de inicio enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
};

const startTemperature = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('STARTT');
        res.json({ message: 'Señal de inicio enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
}

const stopTemperature = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('STOPT');
        res.json({ message: 'Señal de parada enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
}

const startOxygen = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('STARTO');
        res.json({ message: 'Señal de inicio enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
}

const stopOxygen = async (req, res) => {
    const wsClient = getWsClient();
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send('STOPO');
        res.json({ message: 'Señal de parada enviada al ESP32' });
    } else {
        res.status(500).json({ message: 'No hay conexión WebSocket con el ESP32' });
    }
}

const startHeartRate = async (req, res) => {
    const wsClient = getWsClient();
    if(wsClient && wsClient.readyState === WebSocket.OPEN){
        wsClient.send('STARTH');
        res.json({message: 'Señal de inicio enviada al ESP32'});
    } else {
        res.status(500).json({message: 'No hay conexión WebSocket con el ESP32'});
    }
}

const stopHeartRate = async (req, res) => {
    const wsClient = getWsClient();
    if(wsClient && wsClient.readyState === WebSocket.OPEN){
        wsClient.send('STOPH');
        res.json({message: 'Señal de parada enviada al ESP32'});
    } else {
        res.status(500).json({message: 'No hay conexión WebSocket con el ESP32'});
    }
}

// Nueva función para almacenar el refreshToken en la sesión
const storeSessionToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send('Falta el token de sesión');
    }

    // Almacenar el token de sesión en la sesión del usuario
    req.session.refreshToken = refreshToken;

    console.log('Session Token almacenado en la sesión:', req.session.refreshToken);

    // Responder con éxito
    res.status(200).send('Token de sesión recibido y almacenado en la sesión');
};

const checkSession = (req, res) => {
    if (!req.session) {
        return res.status(500).send("Session is not available");
    }

    const refreshToken = req.session.refreshToken;
    if (!refreshToken) {
        return res.status(404).send("No refresh token found in session");
    }

    res.send({ refreshToken });
};

const login = async (req, res) => {
    try {
      const { username, password, tenant } = req.body;
      const response = await axios.post(
        `${process.env.AUTH_URL}/login`,
        { username, password, tenant },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer jArnU3u6IiVfQOsL2SKWksW7ubwY5oU6'
          }
        }
      );
      const { accessToken, refreshToken } = response.data;
  
      // Almacenar el refreshToken en la sesión
      req.session.refreshToken = refreshToken;
  
      res.send({ accessToken });
    } catch (err) {
      res.status(401).send("Invalid credentials");
    }
  };


  const signout = async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).send("Missing secret header");
      const secret = authHeader.split(" ")[1];
  
      const refreshToken = req.session.refreshToken;
      if (!refreshToken) return res.status(401).send("Missing refresh token in session");
  
      const tenant = req.query.tenant; // Obtener el tenant de los parámetros de la solicitud
      if (!tenant) return res.status(400).send("Missing tenant");
  
      const url = `${process.env.KEYCLOAK_AUTH_SERVER_URL}/realms/${tenant}/protocol/openid-connect/revoke`;
      const { data } = await axios({
        method: "post",
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `client_id=${tenant}&client_secret=${secret}&token=${refreshToken}&token_type_hint=refresh_token`,
      });
      req.session.destroy(); // Destruir la sesión después de cerrar la sesión
      res.send({ data });
    } catch (err) {
      res.status(500).send(`Error logging out: ${err}`);
    }
  };

// Nueva función para actualizar el nombre de usuario global
const updateUsername = (req, res) => {
    const newUsername = req.body.username || 'usuario_hardcoded';
    setUsername(newUsername);
    res.send(`Username updated to ${newUsername}`);
};

const getAverageOxygen = async (req, res) => {
    const userId = getUsername(); // Obtener el userId de los parámetros de la consulta
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        const averageOxygen = await dataService.getAverageOxygen(userId);
        res.json(averageOxygen);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching average oxygen' });
    }
}

const getAverageHeartRate = async (req, res) => {
    const userId = getUsername(); // Obtener el userId de los parámetros de la consulta
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        const averageHeartRate = await dataService.getAverageHeartRate(userId);
        res.json(averageHeartRate);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching average heart rate' });
    }
}

//Keycloak

const authenticate = async (req,res) => {
    res.send("success");
}


module.exports = {
    create,
    test,
    getAll,
    startTemperature,
    stopTemperature,
    sensorData,
    startSensorData,
    stopSensorData,
    sensorTemperature,
    stopOxygen,
    startOxygen,
    sensorOxygen,
    startHeartRate,
    stopHeartRate,
    sensorHeartRate,
    createOxygen,
    getAllOxygen,
    storeSessionToken,
    checkSession,
    login,
    signout,
    updateUsername,
    createDevice,
    getDevice,
    createHeartRate,
    getAllHeartRate,
    getAverageTemperature,
    storeDeviceId,
    getDeviceId,
    getAverageOxygen,
    getAverageHeartRate,
    authenticate
}

