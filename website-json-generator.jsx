import React, { useState, useRef } from 'react';
import { Upload, X, Sparkles, Check } from 'lucide-react';

// Context
import { BlueprintProvider } from './src/context/BlueprintContext';
import { ToastProvider } from './src/context/ToastContext';

// Hooks
import useBlueprint from './src/hooks/useBlueprint';
import useToast from './src/hooks/useToast';

// Components
import PhaseManager from './src/components/layout/PhaseManager';
import Sidebar from './src/components/layout/Sidebar';
import MobileHeader from './src/components/layout/MobileHeader';
import CommandHUD from './src/components/layout/CommandHUD';
import MobileJsonModal from './src/components/features/MobileJsonModal';
import MagicModal from './src/components/features/MagicModal';

// Utils
import { generateBriefMarkdown } from './src/utils/generateBriefMarkdown';

function PromptArchitectLayout() {
    const [activeTab, setActiveTab] = useState('init');
    const [isJsonSidebarOpen, setIsJsonSidebarOpen] = useState(true);
    const [showMobileJson, setShowMobileJson] = useState(false);
    const [showMagicModal, setShowMagicModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef(null);

    const {
        data,
        setBriefSafely,
        resetData,
        validationStatus,
        phaseStatus
    } = useBlueprint();
    const { showToast } = useToast();

    // -- Handlers --

    const handleImportJSON = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                await setBriefSafely(e.target.result, 'import');
                showToast("Blueprint imported successfully!", "success");
            } catch (err) {
                showToast("Invalid JSON file. Please check the format.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${data.project_name?.toLowerCase().replace(/\s+/g, '_') || 'studio_brief'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Copies the Markdown Brief
    const copyToClipboard = () => {
        const markdown = generateBriefMarkdown(data);
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        showToast("Brief copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-obsidian-900 text-slate-300 font-sans overflow-hidden">

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
            />

            <MagicModal
                isOpen={showMagicModal}
                onClose={() => setShowMagicModal(false)}
            />

            <MobileHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowMobileJson={setShowMobileJson}
                clearData={resetData}
                phaseStatus={phaseStatus}
            />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowMagicModal={setShowMagicModal}
                clearData={resetData}
                phaseStatus={phaseStatus}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <CommandHUD data={data} validationStatus={validationStatus} />

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Phase Canvas */}
                    <PhaseManager
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {/* JSON Preview Sidebar (Desktop) */}
                    <div
                        className={`hidden md:flex bg-obsidian-900 border-l border-glass-border flex-col transition-all duration-300 shrink-0 ${isJsonSidebarOpen ? 'w-96' : 'w-12'}`}
                    >
                        <div className="p-4 border-b border-glass-border flex justify-between items-center h-16">
                            {isJsonSidebarOpen && <h3 className="font-bold text-slate-200 whitespace-nowrap font-display">Live Studio Brief</h3>}
                            <button
                                onClick={() => setIsJsonSidebarOpen(!isJsonSidebarOpen)}
                                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
                            >
                                <X className={`w-4 h-4 transition-transform ${isJsonSidebarOpen ? '' : 'rotate-45'}`} />
                            </button>
                        </div>

                        {isJsonSidebarOpen && (
                            <>
                                <div className="p-2 border-b border-glass-border flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all bg-white/5 hover:bg-white/10 text-slate-300"
                                        title="Import JSON"
                                    >
                                        <Upload className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={downloadJSON}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all bg-white/5 hover:bg-white/10 text-slate-300"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Export
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${copied
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-acid-500 hover:bg-acid-400 text-obsidian-900'
                                            }`}
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-acid-400 bg-obsidian-950">
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            </>
                        )}
                        {!isJsonSidebarOpen && (
                            <div className="flex-1 flex flex-col items-center pt-4 gap-4">
                                <button
                                    onClick={() => setIsJsonSidebarOpen(true)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                                >
                                    <X className="w-5 h-5 rotate-45" />
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                                >
                                    <Upload className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={downloadJSON}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <MobileJsonModal
                        showMobileJson={showMobileJson}
                        setShowMobileJson={setShowMobileJson}
                        data={data}
                        downloadJSON={downloadJSON}
                        copyToClipboard={copyToClipboard}
                        copied={copied}
                        onImport={() => fileInputRef.current?.click()}
                    />
                </div>
            </div>
        </div>
    );
}

export default function PromptArchitect() {
    return (
        <ToastProvider>
            <BlueprintProvider>
                <PromptArchitectLayout />
            </BlueprintProvider>
        </ToastProvider>
    );
}