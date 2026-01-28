/**
 * TaskItem Component
 *
 * Displays a single task with interactive controls for toggling completion,
 * editing, and deleting. Includes loading states and accessibility features.
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Task } from '@/lib/types';
import { toggleComplete, deleteTask } from '@/lib/api';
import CategoryBadge from './CategoryBadge';
import PriorityBadge from './PriorityBadge';
import DueDateBadge from './DueDateBadge';

interface TaskItemProps {
  task: Task;
  onToggle: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle checkbox toggle for task completion
   */
  const handleToggle = async () => {
    if (isToggling) return;

    setIsToggling(true);
    setError(null);

    try {
      const updatedTask = await toggleComplete(task.id);
      onToggle(updatedTask);

      // Show success notification
      toast.success(updatedTask.completed ? '✓ Task completed!' : '↻ Task reopened');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
      toast.error(err instanceof Error ? err.message : 'Failed to toggle task');
      console.error('Toggle error:', err);
    } finally {
      setIsToggling(false);
    }
  };

  /**
   * Handle task deletion with confirmation
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);
    setShowDeleteConfirm(false);

    try {
      // Call parent's delete handler (which handles API call)
      onDelete(task.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl border shadow-md p-5
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${task.completed ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-200 hover:border-indigo-300'}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
        animate-slideUp
      `}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      {/* Main Content */}
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <button
            onClick={handleToggle}
            disabled={isToggling || isDeleting}
            className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${task.completed
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500'
                : 'border-gray-300 hover:border-indigo-500 bg-white'
              }
              ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          >
            {task.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white animate-scaleIn"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className={`
              text-lg font-semibold mb-2 transition-all duration-300
              ${task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900'
              }
            `}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`
                text-sm mb-3 whitespace-pre-wrap break-words leading-relaxed
                ${task.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-600'
                }
              `}
            >
              {task.description}
            </p>
          )}

          {/* Category, Priority, and Due Date Badges */}
          {(task.category || task.priority || task.due_date) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.category && <CategoryBadge category={task.category} />}
              {task.priority && <PriorityBadge priority={task.priority} />}
              {task.due_date && <DueDateBadge dueDate={task.due_date} completed={task.completed} />}
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span title={new Date(task.created_at).toLocaleString()}>
                Created {formatDate(task.created_at)}
              </span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span title={new Date(task.updated_at).toLocaleString()}>
                  Updated {formatDate(task.updated_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            disabled={isToggling || isDeleting}
            className={`
              p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50
              rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              transform hover:scale-110 active:scale-95
            `}
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isToggling || isDeleting}
            className={`
              p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50
              rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              transform hover:scale-110 active:scale-95
            `}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2 animate-slideDown"
          role="alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {(isToggling || isDeleting) && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-indigo-200 border-t-indigo-600" />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3
              id="delete-dialog-title"
              className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center"
            >
              Delete Task?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className={`
                  flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                  rounded-xl transition-all duration-200 font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`
                  flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                  rounded-xl transition-all duration-200 font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                `}
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
