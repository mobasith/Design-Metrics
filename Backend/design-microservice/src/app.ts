import express from 'express';
import connectDB from './config/db';
import designRoutes from './routes/designRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use('/api/designs', designRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
