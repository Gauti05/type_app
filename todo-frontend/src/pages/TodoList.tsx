import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../store/authStore';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});
type TodoFormInputs = z.infer<typeof todoSchema>;

const TodoList: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormInputs>({
    resolver: zodResolver(todoSchema),
  });

  const fetchTodos = async () => {
    const res = await axios.get('/api/todos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const { data: todos, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const createOrUpdateTodo = useMutation({
    mutationFn: async (todo: Todo & { id?: string }) => {
      if (todo.id) {
        return axios.put(`/api/todos/${todo.id}`, todo, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        return axios.post('/api/todos', todo, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      reset();
      setEditingTodo(null);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      return axios.put(
        `/api/todos/${todo._id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  const onSubmit = (data: TodoFormInputs) => {
    createOrUpdateTodo.mutate(editingTodo ? { ...data, id: editingTodo._id } : data);
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    reset({ title: todo.title, description: todo.description });
  };

  if (isLoading || isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {isLoading ? 'Loading todos...' : <span className="text-red-600">Failed to load todos</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 max-h-[85vh] overflow-y-auto">

        <h1 className="text-4xl font-bold mb-8 text-gray-700 text-center">
          My Todo List
        </h1>

       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-10">
          <input
            type="text"
            placeholder="Title"
            {...register('title')}
            className={`w-full p-3 rounded border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              errors.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Description (optional)"
            {...register('description')}
            rows={3}
            className="w-full p-3 rounded border resize-none border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
            >
              {editingTodo
                ? isSubmitting ? 'Updating...' : 'Update Todo'
                : isSubmitting ? 'Adding...' : 'Add Todo'}
            </button>

            {editingTodo && (
              <button
                type="button"
                onClick={() => {
                  setEditingTodo(null);
                  reset();
                }}
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

       
        <ul className="space-y-4">
          {todos?.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-50 rounded shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompletedMutation.mutate(todo)}
                  className="w-5 h-5 cursor-pointer"
                />

                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </h2>

                  {todo.description && (
                    <p className={`text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 ml-4 text-sm">
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure?'))
                      deleteTodoMutation.mutate(todo._id);
                  }}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}

          {todos?.length === 0 && (
            <li className="text-center text-gray-500 py-4">
              No todos found. Add some tasks!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;


