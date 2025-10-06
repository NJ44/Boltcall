import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Edit3,
  Calendar, 
  Star,
  X,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 1,
      text: 'Set up phone number for AI receptionist',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-15',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      text: 'Configure business hours and availability',
      completed: false,
      priority: 'medium',
      dueDate: '2024-01-12',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      text: 'Add knowledge base articles',
      completed: true,
      priority: 'medium',
      createdAt: '2024-01-09'
    },
    {
      id: 4,
      text: 'Test AI receptionist with sample calls',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-14',
      createdAt: '2024-01-11'
    },
    {
      id: 5,
      text: 'Review and optimize call scripts',
      completed: false,
      priority: 'low',
      createdAt: '2024-01-11'
    }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: newTodoPriority,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-3 h-3 fill-current" />;
      case 'medium': return <Star className="w-3 h-3" />;
      case 'low': return <Star className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your task management center</p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
          <span className="text-sm text-gray-500">{completedTodos} of {totalTodos} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          </div>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="px-2 py-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
          </div>
                    ) : (
            <div className="flex items-center gap-3">
                        <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {todo.text}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                          {getPriorityIcon(todo.priority)}
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                            <Calendar className="w-3 h-3" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
            </div>

                  {/* Actions */}
                  {editingId !== todo.id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
          </div>
                  )}
            </div>
          </div>
            ))
          )}
        </div>
      </div>

      {/* Agents Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Agents</h3>
              <p className="text-sm text-gray-600">Manage your AI receptionist agents</p>
            </div>
          </div>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Agents
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No agents created yet</h4>
          <p className="text-gray-600 mb-4">Create your first AI agent to start handling calls</p>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Agent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
