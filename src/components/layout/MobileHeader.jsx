import React from 'react';
import { Globe, Code, Trash2, Check, AlertTriangle } from 'lucide-react';
import { PHASES } from '../../data/constants';

const MobileHeader = ({ activeTab, setActiveTab, setShowMobileJson, clearData, phaseStatus }) => {
    return (
        <div className="md:hidden flex flex-col bg-obsidian-900 border-b border-glass-border shrink-0">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-acid-500">
                    <Globe className="w-5 h-5" />
                    <span className="font-bold font-display text-lg tracking-tight text-white">TLM13 Labs</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMobileJson(true)}
                        className="p-2 bg-obsidian-800 text-slate-200 rounded-md border border-glass-border flex items-center gap-2 text-sm font-medium hover:bg-obsidian-700"
                        aria-label="View JSON"
                    >
                        <Code className="w-4 h-4" />
                    </button>
                    <button
                        onClick={clearData}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        aria-label="Clear all data"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {/* Mobile Phase Navigation (Horizontal Scroll) */}
            <nav className="flex overflow-x-auto scrollbar-hide border-t border-glass-border" role="tablist" aria-label="Command phases">
                {PHASES.map((phase) => {
                    const isActive = activeTab === phase.id;
                    const status = phaseStatus?.[phase.id];
                    const isComplete = status === 'complete';
                    const hasWarning = status === 'warning';

                    return (
                        <button
                            key={phase.id}
                            onClick={() => setActiveTab(phase.id)}
                            role="tab"
                            aria-selected={isActive}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                                ? 'text-acid-500 border-acid-500 bg-acid-500/5'
                                : 'text-slate-400 border-transparent hover:text-white'
                                }`}
                        >
                            <phase.icon className="w-4 h-4" />
                            <span className="font-display text-xs font-bold tracking-wider">{phase.label}</span>
                            {isComplete && <Check className="w-3 h-3 text-green-400" />}
                            {hasWarning && <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileHeader;
