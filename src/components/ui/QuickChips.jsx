import React from 'react';

const QuickChips = ({ options, onSelect, ariaLabel = "Quick selection options" }) => (
    <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label={ariaLabel}>
        {options.map((opt) => (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                className="px-2 py-1 text-xs font-medium bg-white/5 hover:bg-acid-500 text-slate-300 hover:text-obsidian-900 rounded-md transition-all border border-glass-border hover:border-acid-500"
                aria-label={`Add ${opt}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

export default QuickChips;