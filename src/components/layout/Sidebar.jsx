import React from 'react';
import { Globe, Sparkles, Trash2, Check, AlertTriangle } from 'lucide-react';
import { PHASES } from '../../data/constants';

const Sidebar = ({ activeTab, setActiveTab, setShowMagicModal, clearData, phaseStatus }) => {
    return (
        <aside className="hidden md:flex w-64 bg-obsidian-900 border-r border-glass-border flex-col shrink-0" aria-label="Command Index">
            <div className="p-6 border-b border-glass-border">
                <div className="flex items-center gap-2 text-acid-500 mb-1">
                    <Globe className="w-6 h-6" aria-hidden="true" />
                    <span className="font-display font-bold text-lg tracking-tight text-white">TLM13 Labs</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">STUDIO COMMAND CENTER</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4" role="navigation">
                <div className="px-4 mb-6">
                    <button
                        onClick={() => setShowMagicModal(true)}
                        className="w-full bg-acid-500 hover:bg-acid-400 text-obsidian-900 p-3 rounded-lg shadow-glow flex items-center justify-center gap-2 font-bold transition-all group"
                    >
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                        Magic Brief
                    </button>
                </div>

                <div className="px-4 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">Phases</span>
                </div>

                <div role="tablist" aria-label="Command phases">
                    {PHASES.map((phase) => {
                        const Icon = phase.icon;
                        const status = phaseStatus?.[phase.id];
                        const isActive = activeTab === phase.id;
                        const isComplete = status === 'complete';
                        const hasWarning = status === 'warning';

                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActiveTab(phase.id)}
                                role="tab"
                                aria-selected={isActive}
                                className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all border-l-2 group ${isActive
                                    ? 'bg-acid-500/5 text-acid-500 border-acid-500'
                                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-display font-bold text-xs tracking-wider">
                                            {phase.label}
                                        </span>
                                        {isComplete && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500/20" title="Phase complete">
                                                <Check className="w-2.5 h-2.5 text-green-400" />
                                            </span>
                                        )}
                                        {hasWarning && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500/20" title="Needs attention">
                                                <AlertTriangle className="w-2.5 h-2.5 text-yellow-400" />
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-sans ${isActive ? 'text-acid-500/60' : 'text-slate-600'}`}>
                                        {phase.description}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-glass-border space-y-2">
                <button
                    onClick={clearData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-md text-sm transition-colors font-mono"
                    aria-label="Reset all form data"
                >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    RESET_DATA
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
