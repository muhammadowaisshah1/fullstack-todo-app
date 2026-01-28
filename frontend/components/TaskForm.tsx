// frontend/components/TaskForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import CategorySelector from './CategorySelector';
import PrioritySelector from './PrioritySelector';
import DatePicker from './DatePicker';

/**
 * TaskForm Component Props
 */
interface TaskFormProps {
  /** Callback function called when form is submitted with valid data */
  onSubmit: (title: string, description: string, category?: string | null, priority?: string, dueDate?: Date | null) => Promise<void>;

  /** Initial title value (for edit mode) */
  initialTitle?: string;

  /** Initial description value (for edit mode) */
  initialDescription?: string;

  /** Initial category value (for edit mode) */
  initialCategory?: string | null;

  /** Initial priority value (for edit mode) */
  initialPriority?: string | null;

  /** Initial due date value (for edit mode) */
  initialDueDate?: string | null;

  /** Custom label for submit button (default: "Create Task") */
  submitLabel?: string;

  /** Optional callback for cancel button */
  onCancel?: () => void;
}

/**
 * Form data interface
 */
interface FormData {
  title: string;
  description: string;
}

/**
 * Validation errors interface
 */
interface ValidationErrors {
  title?: string;
  description?: string;
}

/**
 * TaskForm Component
 *
 * A reusable form component for creating and editing tasks.
 * Supports client-side validation, loading states, and error handling.
 *
 * @example
 * // Create mode
 * <TaskForm
 *   onSubmit={handleCreateTask}
 *   submitLabel="Create Task"
 * />
 *
 * @example
 * // Edit mode
 * <TaskForm
 *   onSubmit={handleUpdateTask}
 *   initialTitle="Existing title"
 *   initialDescription="Existing description"
 *   submitLabel="Update Task"
 *   onCancel={handleCancel}
 * />
 */
export default function TaskForm({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialCategory = null,
  initialPriority = null,
  initialDueDate = null,
  submitLabel = 'Create Task',
  onCancel,
}: TaskFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: initialTitle,
    description: initialDescription,
  });

  // Category state
  const [category, setCategory] = useState<string | null>(initialCategory);

  // Priority state
  const [priority, setPriority] = useState<string>(initialPriority || 'medium');

  // Due date state
  const [dueDate, setDueDate] = useState<Date | null>(
    initialDueDate ? new Date(initialDueDate) : null
  );

  // Loading state
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // API error message
  const [error, setError] = useState<string>('');

  /**
   * Validate form data
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 1) {
      errors.title = 'Title must be at least 1 character';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must not exceed 200 characters';
    }

    // Description validation
    if (formData.description.length > 1000) {
      errors.description = 'Description must not exceed 1000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the onSubmit callback with trimmed values, category, priority, and due date
      await onSubmit(formData.title.trim(), formData.description.trim(), category, priority, dueDate);

      // Reset form after successful submission (only in create mode)
      if (!initialTitle && !initialDescription) {
        setFormData({ title: '', description: '' });
        setCategory(null);
        setPriority('medium');
        setDueDate(null);
      }
    } catch (err) {
      // Handle error from parent component
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Clear API error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            aria-required="true"
            aria-invalid={!!validationErrors.title}
            aria-describedby={validationErrors.title ? 'title-error' : undefined}
            className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            placeholder="Enter task title"
            disabled={loading}
          />
          <div className="mt-2 flex justify-between items-start">
            {validationErrors.title ? (
              <p id="title-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.title}
              </p>
            ) : (
              <span className="text-xs text-gray-500">Required, 1-200 characters</span>
            )}
            <span className={`text-xs font-medium ml-2 ${formData.title.length > 180 ? 'text-orange-600' : 'text-gray-500'}`}>
              {formData.title.length}/200
            </span>
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            aria-invalid={!!validationErrors.description}
            aria-describedby={validationErrors.description ? 'description-error' : undefined}
            className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical transition-all duration-200 ${
              validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            placeholder="Enter task description (optional)"
            disabled={loading}
          />
          <div className="mt-2 flex justify-between items-start">
            {validationErrors.description ? (
              <p id="description-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.description}
              </p>
            ) : (
              <span className="text-xs text-gray-500">Optional, max 1000 characters</span>
            )}
            <span className={`text-xs font-medium ml-2 ${formData.description.length > 900 ? 'text-orange-600' : 'text-gray-500'}`}>
              {formData.description.length}/1000
            </span>
          </div>
        </div>

        {/* Category Selector */}
        <CategorySelector
          value={category}
          onChange={setCategory}
        />

        {/* Priority Selector */}
        <PrioritySelector
          value={priority}
          onChange={setPriority}
        />

        {/* Due Date Picker */}
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
        />

        {/* Error Message */}
        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-xl animate-slideDown"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              submitLabel
            )}
          </button>

          {/* Cancel Button (optional) */}
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
