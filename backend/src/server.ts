import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';


import errorMiddleware from './middleware/errorMiddleware';







dotenv.config(); 

const app = express();


connectDB();


app.use(express.json());
app.use(cors());
app.use(errorMiddleware);


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
