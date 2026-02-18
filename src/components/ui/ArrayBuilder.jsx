import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import QuickChips from './QuickChips';

const ArrayBuilder = ({ items = [], onChange, placeholder = "Add new item...", quickOptions = [], ariaLabel }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = (val) => {
        const itemToAdd = val || newItem;
        if (itemToAdd.trim() && !items.includes(itemToAdd.trim())) {
            onChange([...items, itemToAdd.trim()]);
            setNewItem('');
        }
    };

    const handleRemove = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-3" role="group" aria-label={ariaLabel || "Item list builder"}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-obsidian-800 border border-glass-border rounded-md px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-acid-500 focus:border-acid-500 placeholder-slate-600 transition-all"
                    placeholder={placeholder}
                    aria-label={placeholder}
                />
                <button
                    onClick={() => handleAdd()}
                    className="bg-acid-500 hover:bg-acid-400 text-obsidian-900 px-4 py-2 rounded-md transition-colors"
                    aria-label="Add item"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {quickOptions.length > 0 && (
                <QuickChips options={quickOptions} onSelect={handleAdd} />
            )}

            {items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Added items">
                    {items.map((item, index) => (
                        <span
                            key={index}
                            role="listitem"
                            className="flex items-center gap-2 bg-white/5 border border-glass-border text-slate-300 px-3 py-1 rounded-full text-sm animate-in fade-in zoom-in duration-200"
                        >
                            {item}
                            <button
                                onClick={() => handleRemove(index)}
                                className="hover:text-red-400 transition-colors"
                                aria-label={`Remove ${item}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArrayBuilder;
