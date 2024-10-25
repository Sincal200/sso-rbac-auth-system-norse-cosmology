const Temperature = require('../models/Temperature');
const Oxygen = require('../models/Oxygen');
const Device = require('../models/Device');
const HeartData = require('../models/HeartData');

const getAll = async () => {
    return await Temperature.find({});
}

const create = async (temperature) => {
    return await Temperature.create(temperature);
}

const getAllOxygen = async () => {
    return await Oxygen.find({});
}

const createOxygen = async (oxygen) => {
    return await Oxygen.create(oxygen);
}

const createDevice = async (device) => {
    return await Device.create(device);
}

const getDevice = async () => {
    return await Device.find({});
}

const createHeartData = async (heartData) => {
    return await HeartData.create(heartData);
}

const getHeartData = async () => {
    return await HeartData.find({});
}

const getAverageTemperature = async (userId) => {
    const temperatures = await Temperature.find({ user: userId });
    const totalTemperatures = temperatures.length;

    if (totalTemperatures === 0) {
        return {
            averageTemperatureC: 0,
            averageTemperatureF: 0
        };
    }

    const sumTemperaturesC = temperatures.reduce((sum, temp) => sum + temp.temperatureC, 0);
    const sumTemperaturesF = temperatures.reduce((sum, temp) => sum + temp.temperatureF, 0);
    
    const averageTemperatureC = (sumTemperaturesC / totalTemperatures).toFixed(2);
    const averageTemperatureF = (sumTemperaturesF / totalTemperatures).toFixed(2);
    
    return {
        averageTemperatureC,
        averageTemperatureF
    };
}

const getAverageOxygen = async (userId) => {
    const oxygenData = await Oxygen.find({ user: userId });
    const totalOxygenData = oxygenData.length;

    if (totalOxygenData === 0) {
        return {
            averageOxygen: 0
        };
    }

    const sumOxygen = oxygenData.reduce((sum, data) => sum + data.value, 0);
    const averageOxygen = (sumOxygen / totalOxygenData).toFixed(2);

    return {
        averageOxygen
    };
}

const getAverageHeartRate = async (userId) => {
    const heartData = await HeartData.find({ user: userId });
    const totalHeartData = heartData.length;

    if (totalHeartData === 0) {
        return {
            averageBpm: 0,
            averageAvgBpm: 0
        };
    }

    const sumBpm = heartData.reduce((sum, data) => sum + data.bpm, 0);
    const sumAvgBpm = heartData.reduce((sum, data) => sum + data.avgBpm, 0);

    const averageBpm = (sumBpm / totalHeartData).toFixed(2);
    const averageAvgBpm = (sumAvgBpm / totalHeartData).toFixed(2);

    return {
        averageBpm,
        averageAvgBpm
    };
}


module.exports = {
    create,
    getAll,
    createOxygen,
    getAllOxygen,
    createDevice,
    getDevice,
    createHeartData,
    getHeartData,
    getAverageTemperature,
    getAverageOxygen,
    getAverageHeartRate
}