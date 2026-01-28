/**
 * DatePicker Component
 *
 * Provides a date picker for selecting task due dates.
 * Features:
 * - Calendar-based date selection
 * - Prevents selecting past dates
 * - Clearable selection
 * - Dark mode support
 * - Accessible with proper labels
 */

'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
}

export default function DatePicker({ value, onChange, label = 'Due Date', minDate }: DatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">(Optional)</span>
      </label>
      <div className="relative">
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          minDate={minDate || new Date()}
          dateFormat="MMM dd, yyyy"
          placeholderText="Select due date"
          isClearable
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all"
          wrapperClassName="w-full"
          calendarClassName="dark:bg-gray-800 dark:border-gray-700"
        />
        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
