import React, { createContext, useState, useEffect, useCallback } from 'react';
import { DefaultBrief, BriefSchema } from '../schemas/brief';
import { validateAndRepairBrief } from '../utils/validateAndRepair';
import useGemini from '../hooks/useGemini';
import useToast from '../hooks/useToast';

export const BlueprintContext = createContext(null);

export function BlueprintProvider({ children }) {
    const [data, setData] = useState(DefaultBrief);
    const [isGenerating, setIsGenerating] = useState(false);
    const [validationStatus, setValidationStatus] = useState('passing'); // 'passing' | 'needs_repair' | 'failed'

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const { callGemini } = useGemini(apiKey);
    const { showToast } = useToast();

    // Load from localStorage on mount
    useEffect(() => {
        const loadData = async () => {
            const saved = localStorage.getItem('studio-brief');
            if (saved) {
                try {
                    await setBriefSafely(JSON.parse(saved), 'storage');
                } catch (e) {
                    console.error("Failed to load saved data", e);
                }
            }
        };
        loadData();
    }, []);

    // Save to localStorage on data change
    useEffect(() => {
        localStorage.setItem('studio-brief', JSON.stringify(data));
    }, [data]);

    const setBriefSafely = useCallback(async (inputData, mode = 'storage') => {
        setIsGenerating(true);
        try {
            const result = await validateAndRepairBrief({
                raw: inputData,
                mode,
                geminiRepair: (prompt) => callGemini(prompt),
                BriefSchema,
                DefaultBrief,
                onEvent: (event) => console.log(`[Validation-${mode}]`, event)
            });

            if (result.ok) {
                if (result.repaired) {
                    showToast("Brief repaired to match schema.", "warning");
                }
                setData(result.data);
                setValidationStatus('passing');
                return result.data;
            } else {
                console.error("Validation failed", result.issues);
                showToast("Critical schema mismatch. Data reset (backup saved).", "error");

                // Save Backup
                const backupKey = `brief_backup_${Date.now()}`;
                localStorage.setItem(backupKey, JSON.stringify(result.backupCandidate || inputData));

                setData(DefaultBrief);
                setValidationStatus('failed'); // or 'needs_repair' depending on how we want to treat reset
                return DefaultBrief;
            }
        } catch (error) {
            console.error("setBriefSafely error", error);
            showToast("An unexpected error occurred during validation.", "error");
        } finally {
            setIsGenerating(false);
        }
    }, [callGemini, showToast]);

    const updateField = useCallback(async (path, value) => {
        // Helper to update distinct fields (could be improved with deep clone or immer)
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    }, []);

    const resetData = useCallback(() => {
        setData(DefaultBrief);
    }, []);

    // --- Phase Completion Heuristics ---
    const phaseStatus = React.useMemo(() => {
        const s = {};
        // INIT complete if project_name AND essence AND primary_persona exist
        const initComplete = !!data.project_name && !!data.brand_narrative?.essence && !!data.brand_narrative?.target_audience?.primary_persona;
        const initWarning = data.open_questions?.length > 0;
        s.init = initComplete ? 'complete' : (initWarning ? 'warning' : null);

        // DESIGN complete if style exists AND colors has at least 1
        const designComplete = !!data.design?.style && data.design?.colors?.length > 0;
        s.design = designComplete ? 'complete' : null;

        // RULES complete if framework AND max_colors/max_fonts exist AND QA arrays exist
        const rulesComplete = !!data.tech?.framework && data.constraints?.max_colors != null && data.constraints?.max_fonts != null && data.quality_assurance?.visual != null;
        const rulesWarning = data.open_questions?.length > 0;
        s.rules = rulesComplete ? 'complete' : (rulesWarning ? 'warning' : null);

        // COMPILE complete when validation passing
        s.compile = validationStatus === 'passing' ? 'complete' : null;

        return s;
    }, [data, validationStatus]);

    return (
        <BlueprintContext.Provider value={{
            data,
            setData,
            setBriefSafely,
            isGenerating,
            setIsGenerating,
            validationStatus,
            setValidationStatus,
            callGemini,
            updateField,
            resetData,
            phaseStatus
        }}>
            {children}
        </BlueprintContext.Provider>
    );
}
