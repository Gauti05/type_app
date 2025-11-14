import express, { Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
});


router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const todo = new Todo({
      user: req.user?.id,
      title,
      description,
      completed: false,
    });
    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating todo' });
  }
});


router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo.title = title ?? todo.title;
    todo.description = description ?? todo.description;
    if (typeof completed === 'boolean') {
      todo.completed = completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating todo' });
  }
});


router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid todo ID' });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

   
    await Todo.findByIdAndDelete(id);

    res.json({ message: 'Todo removed' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
});

export default router;

