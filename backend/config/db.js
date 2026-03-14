const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log('New MongoDB connection established');
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // In serverless, we don't necessarily want to exit the process, 
        // as the container might be reused. But for now, we'll keep it simple.
        throw error;
    }
};

module.exports = connectDB;

