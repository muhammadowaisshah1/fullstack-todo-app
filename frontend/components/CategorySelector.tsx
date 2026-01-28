/**
 * CategorySelector Component
 *
 * Provides a button-based selector for task categories.
 * Features:
 * - Visual category selection with icons
 * - Toggle selection (click again to deselect)
 * - Color-coded buttons
 * - Dark mode support
 * - Accessible with ARIA labels
 */

'use client';

import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export default function CategorySelector({ value, onChange, label = 'Category' }: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">(Optional)</span>
      </label>
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const isSelected = value === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange(isSelected ? null : cat.value)}
              className={`
                px-4 py-2.5 rounded-lg font-medium transition-all
                flex items-center gap-2
                ${isSelected
                  ? `${CATEGORY_COLORS[cat.color]} ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800 shadow-md`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${cat.label} category`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
