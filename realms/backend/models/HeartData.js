const mongoose = require('mongoose');
const {Schema} = mongoose;

const HeartDataSchema = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        bpm: {
            type: Number,
            required: true
        },
        avgBpm: {
            type: Number,
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

const HeartData = mongoose.model('HeartData', HeartDataSchema);
module.exports = HeartData;