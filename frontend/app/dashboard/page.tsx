// frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Task } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';

/**
 * Protected Dashboard Page
 *
 * Displays user information, task management, and provides logout functionality.
 * Redirects to landing page if user is not authenticated.
 *
 * Features:
 * - Authentication check via localStorage
 * - Task list with filtering and sorting
 * - Create task modal
 * - Edit task modal
 * - Optimistic UI updates
 * - Error handling and loading states
 */
export default function DashboardPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for auth token
        const token = localStorage.getItem('auth_token');

        if (!token) {
          // No token found, redirect to landing page
          router.push('/');
          return;
        }

        // Get user data from localStorage
        const userDataString = localStorage.getItem('user');

        if (!userDataString) {
          // Token exists but no user data, clear token and redirect
          localStorage.removeItem('auth_token');
          router.push('/');
          return;
        }

        // Parse and set user data
        const userData: User = JSON.parse(userDataString);
        setUser(userData);
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear potentially corrupted data and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * Fetch tasks after authentication is confirmed
   */
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = async () => {
    setIsTasksLoading(true);
    setTasksError(null);

    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasksError(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setIsTasksLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Redirect to landing page
    router.push('/');
  };

  /**
   * Handle create task submission
   */
  const handleCreateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    try {
      // Create task via API
      const newTask = await createTask(title, description, category, priority, dueDate);

      // Optimistic update: add task to list immediately
      setTasks(prevTasks => [newTask, ...prevTasks]);

      // Close modal
      setShowCreateModal(false);

      // Show success notification
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      // Re-throw error to be handled by TaskForm
      throw error;
    }
  };

  /**
   * Handle edit task submission
   */
  const handleUpdateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    if (!editingTask) return;

    try {
      // Update task via API
      const updatedTask = await updateTask(editingTask.id, {
        title,
        description,
        category,
        priority,
        due_date: dueDate,
      });

      // Optimistic update: update task in list
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      );

      // Close modal
      setEditingTask(null);

      // Show success notification
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      // Re-throw error to be handled by TaskForm
      throw error;
    }
  };

  /**
   * Handle task update (from toggle completion)
   */
  const handleTaskUpdate = (updatedTask: Task) => {
    // Optimistic update: update task in list
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  /**
   * Handle task deletion
   */
  const handleTaskDelete = async (taskId: number) => {
    try {
      // Delete task via API
      await deleteTask(taskId);

      // Optimistic update: remove task from list
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

      // Show success notification
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      // Show error notification
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  /**
   * Handle edit button click
   */
  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
  };

  /**
   * Close create modal
   */
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  /**
   * Close edit modal
   */
  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // If no user data, don't render anything (redirect is in progress)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Logo/Icon */}
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Todo Dashboard
                </h1>
                <p className="text-indigo-100 dark:text-indigo-200 text-sm mt-0.5">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 font-medium flex items-center justify-center gap-2"
                aria-label="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 animate-slideUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.filter(t => !t.completed).length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.filter(t => t.completed).length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Tasks
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              aria-label="Create new task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Task
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks by title or description..."
            />
          </div>

          <TaskList
            tasks={tasks}
            searchQuery={searchQuery}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            isLoading={isTasksLoading}
            error={tasksError}
          />
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto"
          onClick={handleCloseCreateModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-task-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="create-task-title"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Create New Task
              </h2>
              <button
                onClick={handleCloseCreateModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TaskForm
              onSubmit={handleCreateTask}
              submitLabel="Create Task"
              onCancel={handleCloseCreateModal}
            />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto"
          onClick={handleCloseEditModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-task-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="edit-task-title"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Edit Task
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TaskForm
              onSubmit={handleUpdateTask}
              initialTitle={editingTask.title}
              initialDescription={editingTask.description || ''}
              initialCategory={editingTask.category}
              initialPriority={editingTask.priority}
              initialDueDate={editingTask.due_date}
              submitLabel="Update Task"
              onCancel={handleCloseEditModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
