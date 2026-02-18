import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const MagicButton = ({ onClick, isLoading }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-acid-500 hover:bg-acid-500/10 rounded-md transition-all disabled:opacity-30 group"
        title="Auto-fill with AI"
        aria-label="Auto-fill with AI"
        aria-busy={isLoading}
    >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
    </button>
);

export default MagicButton;