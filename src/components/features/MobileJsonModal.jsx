import React from 'react';
import { Code, X, Download, Check, Copy, Upload } from 'lucide-react';

const MobileJsonModal = ({ showMobileJson, setShowMobileJson, data, downloadJSON, copyToClipboard, copied, onImport }) => {
    if (!showMobileJson) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-obsidian-950 flex flex-col md:hidden animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-json-title"
        >
            <div className="p-4 border-b border-glass-border flex justify-between items-center bg-obsidian-900">
                <h3 id="mobile-json-title" className="font-bold font-display text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-acid-500" />
                    Live Studio Brief
                </h3>
                <button
                    onClick={() => setShowMobileJson(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-acid-400 bg-obsidian-950">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
            <div className="p-4 bg-obsidian-900 border-t border-glass-border flex gap-3">
                {onImport && (
                    <button
                        onClick={onImport}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border border-glass-border transition-colors"
                        aria-label="Import JSON file"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={downloadJSON}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border border-glass-border transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
                <button
                    onClick={copyToClipboard}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all ${copied
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-acid-500 hover:bg-acid-400 text-obsidian-900'
                        }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export default MobileJsonModal;

