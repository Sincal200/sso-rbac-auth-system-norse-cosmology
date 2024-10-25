const mongoose = require('mongoose');
const {Schema} = mongoose;

const OxygenSchema = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        user:{
            type: String
        },
    },
    {
        timestamps: true,
    }
        
);

const Oxygen = mongoose.model('Oxygen', OxygenSchema);
module.exports = Oxygen;