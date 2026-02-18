import React, { useState } from 'react';
import useBlueprint from '../../hooks/useBlueprint';
import useToast from '../../hooks/useToast';
import useArchitect from '../../hooks/useArchitect'; // Import the hook
import { InitPhase, DesignPhase, RulesPhase, CompilePhase } from '../../phases/PhaseContent';
import StrengthMeter from '../features/StrengthMeter';
import { QUESTION_JUMP_MAP, STUDIO_TEMPLATES } from '../../data/constants';

export default function PhaseManager({ activeTab, setActiveTab }) {
    const { data, setData, setBriefSafely, callGemini, validationStatus } = useBlueprint();
    const { showToast } = useToast();
    const { handleArchitecturalAnalysis } = useArchitect(); // Use the hook

    const [loadingField, setLoadingField] = useState(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileSuccess, setCompileSuccess] = useState(false);

    // ... (rest of the file same as before, but using handleArchitecturalAnalysis from hook)

    const handleFieldMagic = async (fieldPath, instruction) => {
        setLoadingField(fieldPath);
        const context = `
          Project Name: ${data.project_name || "Untitled Project"}
          Studio Style: ${data.agency_mode.studio_name || "General Agency"}
          Goal: ${data.brand_narrative.mission || "Build a great website"}
        `;
        const prompt = `
          Context: ${context}
          Task: Generate a creative, high-quality value for the field: "${instruction}".
          Keep it specific, professional, and aligned with the Studio Style.
          Return ONLY the text value. No quotes, no markdown.
        `;
        try {
            const text = await callGemini(prompt);
            const updateData = JSON.parse(JSON.stringify(data));
            const path = fieldPath.split('.');
            let current = updateData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = text.trim();
            await setBriefSafely(updateData, 'field_magic');
        } catch (err) {
            console.error("Field magic failed", err);
            showToast(err.message || "AI generation failed. Please try again.");
        } finally {
            setLoadingField(null);
        }
    };

    const applyTemplate = (template) => {
        const merged = {
            ...data,
            agency_mode: { ...data.agency_mode, ...template.data }
        };
        setBriefSafely(merged, 'template_apply');
    };

    const handleQuestionJump = (question) => {
        const lowerQ = question.toLowerCase();
        for (const mapping of QUESTION_JUMP_MAP) {
            if (mapping.keywords.some(kw => lowerQ.includes(kw))) {
                setActiveTab(mapping.phase);
                setTimeout(() => {
                    const el = document.getElementById(`section-${mapping.section}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
                return;
            }
        }
        setActiveTab('init');
    };

    const handleCompileBrief = async () => {
        setIsCompiling(true);
        setCompileSuccess(false);
        await new Promise(r => setTimeout(r, 1500));
        // In real app, we might do more check here
        setIsCompiling(false);
        setCompileSuccess(true);
        showToast("Brief compiled!", "success");
        setTimeout(() => setCompileSuccess(false), 3000);
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

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 phase-canvas-dark">
            <div className="max-w-3xl mx-auto space-y-6 pb-20">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-tight">Project Blueprint</h1>
                        <p className="text-sm text-slate-400">Define the DNA of your next digital product.</p>
                    </div>
                    <StrengthMeter data={data} />
                </div>

                {activeTab === 'init' && (
                    <InitPhase
                        data={data}
                        setData={setData}
                        loadingField={loadingField}
                        handleFieldMagic={handleFieldMagic}
                        applyTemplate={applyTemplate}
                        handleArchitecturalAnalysis={handleArchitecturalAnalysis}
                    />
                )}
                {activeTab === 'design' && (
                    <DesignPhase
                        data={data}
                        setData={setData}
                        loadingField={loadingField}
                        handleFieldMagic={handleFieldMagic}
                    />
                )}
                {activeTab === 'rules' && (
                    <RulesPhase
                        data={data}
                        setData={setData}
                        loadingField={loadingField}
                        handleFieldMagic={handleFieldMagic}
                        handleQuestionJump={handleQuestionJump}
                    />
                )}
                {activeTab === 'compile' && (
                    <CompilePhase
                        data={data}
                        validationStatus={validationStatus}
                        isCompiling={isCompiling}
                        compileSuccess={compileSuccess}
                        handleCompileBrief={handleCompileBrief}
                        handleCopyJSON={() => {
                            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                            showToast("JSON copied to clipboard!", "success");
                        }}
                        downloadJSON={downloadJSON}
                        setActiveTab={setActiveTab}
                    />
                )}
            </div>
        </div>
    );
}
