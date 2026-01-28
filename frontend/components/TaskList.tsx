/**
 * TaskList Component
 *
 * Displays a filterable, sortable list of tasks with empty and loading states.
 * Supports filtering by completion status and sorting by creation date.
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { CATEGORIES, CATEGORY_COLORS, PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: Task) => void;
  isLoading?: boolean;
  error?: string | null;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TaskList({
  tasks,
  searchQuery,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  isLoading = false,
  error = null,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  /**
   * Filter and sort tasks based on current filter selection and search query
   */
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descMatch;
      });
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = tasks.filter((task) => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter((task) => task.completed);
        break;
      case 'all':
      default:
        filtered = tasks;
        break;
    }

    // Sort: overdue tasks first, then by priority, then by due date, then by creation date
    return filtered.sort((a, b) => {
      const now = new Date();

      // Check if tasks are overdue (only for incomplete tasks)
      const aOverdue = !a.completed && a.due_date && new Date(a.due_date) < now;
      const bOverdue = !b.completed && b.due_date && new Date(b.due_date) < now;

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Priority order: high (0) > medium (1) > low (2)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If same priority, sort by due date (earliest first)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      // If no due dates, sort by newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tasks, filter, searchQuery, categoryFilter, priorityFilter]);

  /**
   * Get task counts for each filter
   */
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  /**
   * Render filter button
   */
  const FilterButton = ({
    type,
    label,
    count,
  }: {
    type: FilterType;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setFilter(type)}
      className={`
        px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transform hover:scale-105 active:scale-95
        ${
          filter === type
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'
        }
      `}
      aria-label={`Show ${label.toLowerCase()} tasks`}
      aria-pressed={filter === type}
    >
      <span className="flex items-center gap-2">
        {label}
        <span
          className={`
            px-2.5 py-0.5 rounded-full text-xs font-bold
            ${
              filter === type
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            }
          `}
        >
          {count}
        </span>
      </span>
    </button>
  );

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading tasks">
        {/* Filter Skeleton */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-11 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Task Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
        <span className="sr-only">Loading tasks...</span>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div
        className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 text-center animate-slideUp"
        role="alert"
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-200 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-900 mb-2">
          Failed to Load Tasks
        </h3>
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  /**
   * Empty State (No Tasks)
   */
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-slideUp">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No Tasks Yet
        </h3>
        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
          Get started by creating your first task using the button above.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Click &quot;New Task&quot; to add your first todo</span>
        </div>
      </div>
    );
  }

  /**
   * Empty Filter State (No Tasks Match Filter)
   */
  if (filteredTasks.length === 0) {
    // Check if it's due to search
    if (searchQuery && searchQuery.trim()) {
      return (
        <div>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Task filters">
            <FilterButton type="all" label="All" count={taskCounts.all} />
            <FilterButton type="active" label="Active" count={taskCounts.active} />
            <FilterButton type="completed" label="Completed" count={taskCounts.completed} />
          </div>

          {/* No Search Results */}
          <div className="text-center py-16 animate-slideUp">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No tasks match &quot;{searchQuery}&quot;
            </p>
          </div>
        </div>
      );
    }

    const emptyMessages = {
      active: {
        title: 'No Active Tasks',
        description: 'All tasks are completed! Great job!',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bgColor: 'from-green-100 to-emerald-100',
      },
      completed: {
        title: 'No Completed Tasks',
        description: 'Complete some tasks to see them here.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bgColor: 'from-blue-100 to-cyan-100',
      },
      all: {
        title: 'No Tasks',
        description: 'Create a task to get started.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        bgColor: 'from-indigo-100 to-purple-100',
      },
    };

    const message = emptyMessages[filter];

    return (
      <div>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Task filters">
          <FilterButton type="all" label="All" count={taskCounts.all} />
          <FilterButton type="active" label="Active" count={taskCounts.active} />
          <FilterButton type="completed" label="Completed" count={taskCounts.completed} />
        </div>

        {/* Empty State */}
        <div className="text-center py-16 animate-slideUp">
          <div className={`flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${message.bgColor} rounded-full`}>
            {message.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {message.title}
          </h3>
          <p className="text-gray-600 text-lg">{message.description}</p>
        </div>
      </div>
    );
  }

  /**
   * Main Task List View
   */
  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label="Task filters">
        <FilterButton type="all" label="All" count={taskCounts.all} />
        <FilterButton type="active" label="Active" count={taskCounts.active} />
        <FilterButton type="completed" label="Completed" count={taskCounts.completed} />
      </div>

      {/* Category Filter */}
      {tasks.some(t => t.category) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              categoryFilter === null
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => {
            const count = tasks.filter(t => t.category === cat.value).length;
            if (count === 0) return null;

            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === cat.value
                    ? CATEGORY_COLORS[cat.color]
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Priority Filter */}
      {tasks.some(t => t.priority) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setPriorityFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              priorityFilter === null
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Priorities
          </button>
          {PRIORITIES.map(pri => {
            const count = tasks.filter(t => t.priority === pri.value).length;
            if (count === 0) return null;

            return (
              <button
                key={pri.value}
                onClick={() => setPriorityFilter(pri.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  priorityFilter === pri.value
                    ? PRIORITY_COLORS[pri.color]
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{pri.icon}</span>
                <span>{pri.label}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Task Count Summary */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span>
          Showing <span className="font-bold text-gray-900">{filteredTasks.length}</span> {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task List */}
      <div
        className="space-y-4"
        role="list"
        aria-label={`${filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Completed'} tasks`}
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <TaskItem
                task={task}
                onToggle={onTaskUpdate}
                onDelete={onTaskDelete}
                onEdit={onTaskEdit}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
