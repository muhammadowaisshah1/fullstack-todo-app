/**
 * PrioritySelector Component
 *
 * Provides a button-based selector for task priority levels.
 * Features:
 * - Visual priority selection with icons
 * - Color-coded buttons (high=red, medium=yellow, low=green)
 * - Always has a selection (defaults to medium)
 * - Dark mode support
 * - Accessible with ARIA labels
 */

'use client';

import { PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';

interface PrioritySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
}

export default function PrioritySelector({ value, onChange, label = 'Priority' }: PrioritySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {PRIORITIES.map(pri => {
          const isSelected = value === pri.value;
          return (
            <button
              key={pri.value}
              type="button"
              onClick={() => onChange(pri.value)}
              className={`
                px-4 py-2.5 rounded-lg font-medium transition-all
                flex items-center gap-2
                ${isSelected
                  ? `${PRIORITY_COLORS[pri.color]} ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800 shadow-md`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Set priority to ${pri.label}`}
            >
              <span className="text-lg">{pri.icon}</span>
              <span>{pri.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
