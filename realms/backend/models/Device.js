const mongoose = require('mongoose');
const {Schema} = mongoose;

const DeviceSchema = new Schema(    
    {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }
);

const Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;