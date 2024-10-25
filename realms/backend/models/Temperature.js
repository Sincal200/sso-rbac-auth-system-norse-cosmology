const mongoose = require('mongoose');
const {Schema} = mongoose;

const TemperatureSchema = new Schema(
    {
        temperatureC: {
            type: Number,
            default: 0,
            required: true
        },
        temperatureF: {
            type: Number,
            default: 0,
            required: true
        },
        user:{
            type: String
        }
    },
    {
        timestamps: true,
    }
        
);

const Temperature = mongoose.model('Temperature', TemperatureSchema);

module.exports = Temperature;