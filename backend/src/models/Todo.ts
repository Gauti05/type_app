import mongoose, { Document, Schema } from 'mongoose';


export interface ITodo extends Document {
  user: mongoose.Types.ObjectId; 
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema: Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
  }
);

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;
