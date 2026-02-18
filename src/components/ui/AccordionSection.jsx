import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionSection = ({ title, icon: Icon, defaultOpen = false, children, badge, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`rounded-xl border border-glass-border overflow-hidden transition-all ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02] group"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-1.5 rounded-md bg-acid-500/10">
                            <Icon className="w-4 h-4 text-acid-500" aria-hidden="true" />
                        </div>
                    )}
                    <span className="font-display font-bold text-white text-sm tracking-tight">{title}</span>
                    {badge && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-acid-500/10 text-acid-500">
                            {badge}
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                />
            </button>
            <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-5 pb-5 pt-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionSection;
