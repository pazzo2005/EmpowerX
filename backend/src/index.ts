import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'; // 👈 import the connect function
import authRoutes from './routes/authRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('🚀 Y2Prove Backend API is running!');
});

// Connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 Server running at http://localhost:${PORT}`);
  });
});
