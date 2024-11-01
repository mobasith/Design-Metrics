import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analyticsRoutes';


dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ANALYTICSDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
