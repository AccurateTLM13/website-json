import React from 'react';
import MagicButton from './MagicButton';

const TextArea = ({ value, onChange, placeholder, hasMagic, onMagic, magicLoading, id, ariaLabel }) => (
    <div className="relative group">
        <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-obsidian-800 border border-glass-border rounded-md px-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-acid-500 focus:border-acid-500 placeholder-slate-600 min-h-[100px] pr-10 transition-all font-sans"
            placeholder={placeholder}
            aria-label={ariaLabel || placeholder}
        />
        {hasMagic && <MagicButton onClick={onMagic} isLoading={magicLoading} />}
    </div>
);

export default TextArea;