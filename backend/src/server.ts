import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';

// ...
import errorMiddleware from './middleware/errorMiddleware';

// ... existing middleware and routes





dotenv.config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(errorMiddleware);


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
// Basic test route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
