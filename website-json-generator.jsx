import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Bot,
    BookOpen,
    Palette,
    Cpu,
    ListChecks,
    Lightbulb,
    Check,
    Sparkles,
    Wand2,
    Loader2,
    X,
    Upload,
    AlertCircle,
    CheckCircle,
    Users,
    Type,
    Image,
    MousePointer,
    Smartphone,
    FileCode,
    Ban,
    MessageSquare,
    HelpCircle,
    ArrowRight,
    Copy,
    Download,
    RefreshCw,
    Terminal,
    Rocket,
    ExternalLink
} from 'lucide-react';

// Components
import Card from './src/components/ui/Card';
import SectionHeader from './src/components/ui/SectionHeader';
import QuickChips from './src/components/ui/QuickChips';
import InputGroup from './src/components/ui/InputGroup';
import TextInput from './src/components/ui/TextInput';
import TextArea from './src/components/ui/TextArea';
import ArrayBuilder from './src/components/ui/ArrayBuilder';
import AccordionSection from './src/components/ui/AccordionSection';
import Sidebar from './src/components/layout/Sidebar';
import MobileHeader from './src/components/layout/MobileHeader';
import CommandHUD from './src/components/layout/CommandHUD';
import StrengthMeter from './src/components/features/StrengthMeter';
import MobileJsonModal from './src/components/features/MobileJsonModal';
import ImageAnalyzer from './src/components/features/ImageAnalyzer';

// Phases
import { InitPhase, DesignPhase, RulesPhase, CompilePhase } from './src/phases/PhaseContent';

// Hooks
import useGemini from './src/hooks/useGemini';

// Data
import {
    STUDIO_TEMPLATES,
    PHASES,
    QUESTION_JUMP_MAP,
    QUICK_OPTS_TECH,
    QUICK_OPTS_VALUES,
    QUICK_OPTS_RESPONSIVE,
    QUICK_OPTS_OUTPUT_INCLUDE,
    QUICK_OPTS_OUTPUT_EXCLUDE,
    QUICK_OPTS_FORBIDDEN,
    QUICK_OPTS_INTERACTIONS
} from './src/data/constants';

import { DefaultBrief, BriefSchema, CURRENT_SCHEMA_VERSION } from './src/schemas/brief';
import { validateAndRepairBrief } from './src/utils/validateAndRepair';

export default function PromptArchitect() {
    const [activeTab, setActiveTab] = useState('init');
    const [copied, setCopied] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileSuccess, setCompileSuccess] = useState(false);
    const [validationStatus, setValidationStatus] = useState('passing'); // 'passing' | 'needs_repair' | 'failed'
    const [isJsonSidebarOpen, setIsJsonSidebarOpen] = useState(true);

    // Mobile specific state
    const [showMobileJson, setShowMobileJson] = useState(false);

    // AI State
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingField, setLoadingField] = useState(null); // Tracks which specific field is loading
    const [showMagicModal, setShowMagicModal] = useState(false);
    const [magicPrompt, setMagicPrompt] = useState("");
    const [magicError, setMagicError] = useState("");

    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: "", type: "error" });

    // File input ref for JSON import
    const fileInputRef = useRef(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const { callGemini } = useGemini(apiKey);

    // Show toast notification
    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "error" }), 4000);
    };

    // Initial State (must be declared before useEffects that reference it)
    // Initial State - V2 Schema
    const [data, setData] = useState(DefaultBrief);

    // Hybrid Validation Helper
    // Task A: Helper to enforce validated state
    const setBriefSafely = async (inputData, mode = 'storage') => {
        setIsGenerating(true); // Show loading state during repair if needed
        const result = await validateAndRepairBrief({
            raw: inputData,
            mode,
            geminiRepair: (prompt) => callGemini(prompt),
            BriefSchema,
            DefaultBrief,
            onEvent: (event) => console.log(`[Validation-${mode}]`, event)
        });
        setIsGenerating(false);

        if (result.ok) {
            if (result.repaired) {
                showToast("Brief repaired to match schema.", "warning");
            }
            setData(result.data); // Update State
            return result.data;
        } else {
            // Validation Failed - Backup and Reset
            console.error("Validation failed", result.issues);
            showToast("Critical schema mismatch. Data reset (backup saved).", "error");

            // Save Backup
            const backupKey = `brief_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(result.backupCandidate || inputData));

            setData(DefaultBrief);
            return DefaultBrief;
        }
    };

    // Load from localStorage on mount
    useEffect(() => {
        const loadData = async () => {
            const saved = localStorage.getItem('studio-brief');
            if (saved) {
                try {
                    // We treat storage load as a potential repair scenario if schema drafted
                    // setBriefSafely handles the setData
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

    // Handle JSON file import
    const handleImportJSON = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // setBriefSafely handles setData
                await setBriefSafely(e.target.result, 'import');
                showToast("Blueprint imported successfully!", "success");
            } catch (err) {
                showToast("Invalid JSON file. Please check the format.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };

    const handleFieldMagic = async (fieldPath, instruction) => {
        setLoadingField(fieldPath);

        // Construct context based on what we know so far
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

            const updateData = { ...data };
            const path = fieldPath.split('.');
            let current = updateData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = text.trim();

            // Validate the update before setting state
            await setBriefSafely(updateData, 'field_magic');

        } catch (err) {
            console.error("Field magic failed", err);
            showToast(err.message || "AI generation failed. Please try again.");
        } finally {
            setLoadingField(null);
        }
    };

    const handleMagicGenerate = async () => {
        if (!magicPrompt.trim()) return;
        setIsGenerating(true);
        setMagicError("");

        const systemPrompt = `
You are a Creative Director at a top-tier digital design agency.
Generate a comprehensive JSON blueprint for: "${magicPrompt}".

Create a tailored "Studio Identity" - for enterprise apps use a "Scaler" identity, for art/creative use "Auteur", for local business use "Humanist".

Use this EXACT schema (fill context-aware fields, leave unknowns as empty strings or empty arrays):
{
  "schema_version": "${CURRENT_SCHEMA_VERSION}",
  "agency_mode": { 
    "studio_name": "string", 
    "creative_director": "string (detailed persona with taste and philosophy)", 
    "process": ["4 creative process steps"],
    "values": ["4 core values"],
    "tone_style": "string (adjectives description)",
    "visual_cues": ["4 visual identity markers"],
    "forbid": ["3 things this studio would never do"],
    "principle_override": "string (a guiding design principle)"
  },
  "project_name": "string",
  "brand_narrative": {
    "essence": "string (brand soul in one sentence)",
    "mission": "string (why this exists)",
    "experience": { "hero": "string (vivid hero section description)", "vibe": "string (3 atmospheric adjectives)" },
    "target_audience": {
      "primary_persona": "string (detailed user description with age, context)",
      "pain_points": ["3 specific pain points"],
      "desired_action": "string (main conversion goal)"
    }
  },
  "content": {
    "headline_style": "string (writing style for headlines)",
    "cta_examples": ["3 specific CTA button texts"],
    "tone_examples": ["2 example sentences in brand voice"],
    "avoid_words": ["5 words/phrases to never use"]
  },
  "design": {
    "style": "string (overall visual aesthetic)",
    "visual_references": ["3 vivid mood board descriptions"],
    "colors": ["4-5 specific colors with hex or descriptive names"],
    "typography": {
      "heading_style": "string",
      "body_style": "string", 
      "font_pairing_vibe": "string (reference like 'X meets Y')"
    },
    "imagery": {
      "style": "string",
      "subjects": ["3 image subject types"],
      "avoid": ["3 imagery types to avoid"]
    },
    "interactions": {
      "effects": ["3 animation/effect types"],
      "hover_style": "string",
      "transitions": "string (timing and easing)",
      "microinteractions": ["2 specific microinteractions"]
    },
    "pages": ["pages with key sections, e.g. 'Home: Hero, Features, Testimonials'"]
  },
  "tech": { 
    "framework": "string", 
    "requirements": ["3 technical requirements"],
    "responsive": {
      "approach": "mobile-first",
      "mobile_considerations": ["3 mobile-specific considerations"]
    },
    "output_format": {
      "structure": "string",
      "component_style": "string",
      "include": ["3 things to include"],
      "exclude": ["3 things to exclude"]
    }
  },
  "constraints": {
    "forbidden_patterns": ["4 design anti-patterns"],
    "forbidden_components": ["3 UI elements to avoid"],
    "max_colors": 4,
    "max_fonts": 2
  },
  "quality_assurance": {
    "visual": ["2 visual quality criteria"],
    "ux": ["2 UX quality criteria"],
    "performance": ["2 performance criteria"],
    "brand": ["2 brand alignment criteria"],
    "include_rationale": true
  },
  "open_questions": ["Any clarifications needed from the user if the input was vague. If clear, leave empty."]
}

Return ONLY valid JSON. No markdown, no explanation.`;

        try {
            const text = await callGemini(systemPrompt);
            // setBriefSafely handles setData
            await setBriefSafely(text, 'magic');
            showToast("Blueprint generated successfully!", "success");

            setShowMagicModal(false);
            setMagicPrompt("");
        } catch (err) {
            setMagicError("Failed to generate blueprint. Please try again.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const applyTemplate = (template) => {
        const merged = {
            ...data,
            agency_mode: {
                ...data.agency_mode,
                ...template.data
            }
        };
        // Templates are trusted but validating protects against schema drift
        setBriefSafely(merged, 'template_apply');
    };

    const clearData = () => {
        setData(DefaultBrief);
    };

    const handleArchitecturalAnalysis = async (analysisData) => {
        setIsGenerating(true);
        // showToast("Visual Analysis complete. Consulting Senior Architect...", "success"); // Optional intermediate toast

        try {
            const architectPrompt = `
            You are a Senior Information Architect and Creative Director.
            
            We have just analyzed a website screenshot with the following visual summary:
            "${analysisData.magic_prompt_summary}"
            
            And extracted this preliminary data:
            ${JSON.stringify(analysisData, null, 2)}
            
            TASK:
            Create a comprehensive, cohesively designed Project Blueprint based on this visual analysis.
            The goal is to recreate the *soul* and *system* of the analyzed site, but fully fleshed out.
            
            Use this EXACT schema (fill ALL fields with specific, creative values matching the visual vibe):
            {
              "schema_version": "${CURRENT_SCHEMA_VERSION}",
              "agency_mode": { 
                "studio_name": "string (create a fictional studio name that matches the vibe)", 
                "creative_director": "string (detailed persona)", 
                "process": ["4 creative process steps"],
                "values": ["4 core values"],
                "tone_style": "string",
                "visual_cues": ["4 visual identity markers"],
                "forbid": ["3 things this studio would never do"],
                "principle_override": "string"
              },
              "project_name": "string (invent a fitting project name)",
              "brand_narrative": {
                "essence": "string",
                "mission": "string",
                "experience": { "hero": "string", "vibe": "string" },
                "target_audience": {
                  "primary_persona": "string",
                  "pain_points": ["3 specific pain points"],
                  "desired_action": "string"
                }
              },
              "content": {
                "headline_style": "string",
                "cta_examples": ["3 specific CTA button texts"],
                "tone_examples": ["2 example sentences"],
                "avoid_words": ["5 words to avoid"]
              },
              "design": {
                "style": "string",
                "visual_references": ["3 vivid descriptions"],
                "colors": ["4-5 specific colors from the analysis"],
                "typography": {
                  "heading_style": "string",
                  "body_style": "string", 
                  "font_pairing_vibe": "string"
                },
                "imagery": {
                  "style": "string",
                  "subjects": ["3 image subject types"],
                  "avoid": ["3 things to avoid"]
                },
                "interactions": {
                  "effects": ["3 animation types"],
                  "hover_style": "string",
                  "transitions": "string",
                  "microinteractions": ["2 specific interactions"]
                },
                "pages": ["Home", "About", "Services", "Contact"]
              },
              "tech": { 
                "framework": "React / Tailwind", 
                "requirements": ["3 technical requirements"],
                "responsive": {
                  "approach": "mobile-first",
                  "mobile_considerations": ["3 mobile considerations"]
                },
                "output_format": {
                  "structure": "Single page application",
                  "component_style": "Functional",
                  "include": ["SEO", "Accessibility"],
                  "exclude": ["Backend"]
                }
              },
              "constraints": {
                "forbidden_patterns": ["4 anti-patterns"],
                "forbidden_components": ["3 to avoid"],
                "max_colors": 4,
                "max_fonts": 2
              },
              "quality_assurance": {
                "visual": ["2 QA checks"],
                "ux": ["2 QA checks"],
                "performance": ["2 QA checks"],
                "brand": ["2 QA checks"],
                "include_rationale": true
              },
              "open_questions": ["Any clarifications needed from the user if the input was vague. If clear, leave empty."]
            }
            
            Return ONLY valid JSON.
            `;

            const text = await callGemini(architectPrompt);
            // setBriefSafely handles setData
            await setBriefSafely(text, 'architect');
            showToast("Blueprint fully reconstructed from visual analysis!", "success");

        } catch (err) {
            console.error("Architect error:", err);
            showToast("Architect AI failed to reconstruct the blueprint.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        const promptText = `# Website Generation Brief

You are ${data.agency_mode.studio_name || 'a Creative Director'}.

${data.agency_mode.creative_director ? `## Your Persona\n${data.agency_mode.creative_director}\n` : ''}
${data.agency_mode.tone_style ? `**Tone Style:** ${data.agency_mode.tone_style}\n` : ''}
${data.agency_mode.principle_override ? `**Guiding Principle:** ${data.agency_mode.principle_override}\n` : ''}
${data.agency_mode.visual_cues?.length > 0 ? `**Visual Cues:** ${data.agency_mode.visual_cues.join(', ')}\n` : ''}
${data.agency_mode.forbid?.length > 0 ? `**Strictly Forbid:** ${data.agency_mode.forbid.join(', ')}\n` : ''}

## Project: ${data.project_name || 'Untitled Project'}

### Target Audience
${data.brand_narrative.target_audience?.primary_persona ? `- **Who:** ${data.brand_narrative.target_audience.primary_persona}` : ''}
${data.brand_narrative.target_audience?.pain_points?.length > 0 ? `- **Pain Points:** ${data.brand_narrative.target_audience.pain_points.join(', ')}` : ''}
${data.brand_narrative.target_audience?.desired_action ? `- **Goal:** ${data.brand_narrative.target_audience.desired_action}` : ''}

${data.open_questions?.length > 0 ? `### ❓ Open Questions\n${data.open_questions.map(q => `- [ ] ${q}`).join('\n')}\n` : ''}

### Brand Narrative
${data.brand_narrative.essence ? `- **Essence:** ${data.brand_narrative.essence}` : ''}
${data.brand_narrative.mission ? `- **Mission:** ${data.brand_narrative.mission}` : ''}
${data.brand_narrative.experience?.vibe ? `- **Vibe:** ${data.brand_narrative.experience.vibe}` : ''}
${data.brand_narrative.experience?.hero ? `- **Hero Section:** ${data.brand_narrative.experience.hero}` : ''}

### Content Guidelines
${data.content?.headline_style ? `- **Headlines:** ${data.content.headline_style}` : ''}
${data.content?.cta_examples?.length > 0 ? `- **CTA Examples:** "${data.content.cta_examples.join('", "')}"` : ''}
${data.content?.tone_examples?.length > 0 ? `- **Tone Examples:** "${data.content.tone_examples.join('", "')}"` : ''}
${data.content?.avoid_words?.length > 0 ? `- **Avoid Words:** ${data.content.avoid_words.join(', ')}` : ''}

### Design System
${data.design?.style ? `- **Style:** ${data.design.style}` : ''}
${data.design?.colors?.length > 0 ? `- **Colors:** ${data.design.colors.join(', ')}` : ''}
${data.design?.typography?.heading_style ? `- **Headings:** ${data.design.typography.heading_style}` : ''}
${data.design?.typography?.body_style ? `- **Body Text:** ${data.design.typography.body_style}` : ''}
${data.design?.typography?.font_pairing_vibe ? `- **Font Vibe:** ${data.design.typography.font_pairing_vibe}` : ''}

### Imagery
${data.design?.imagery?.style ? `- **Style:** ${data.design.imagery.style}` : ''}
${data.design?.imagery?.subjects?.length > 0 ? `- **Subjects:** ${data.design.imagery.subjects.join(', ')}` : ''}
${data.design?.imagery?.avoid?.length > 0 ? `- **Avoid:** ${data.design.imagery.avoid.join(', ')}` : ''}

### Interactions
${data.design?.interactions?.hover_style ? `- **Hover:** ${data.design.interactions.hover_style}` : ''}
${data.design?.interactions?.transitions ? `- **Transitions:** ${data.design.interactions.transitions}` : ''}
${data.design?.interactions?.effects?.length > 0 ? `- **Effects:** ${data.design.interactions.effects.join(', ')}` : ''}
${data.design?.interactions?.microinteractions?.length > 0 ? `- **Microinteractions:** ${data.design.interactions.microinteractions.join(', ')}` : ''}

### Pages
${data.design?.pages?.length > 0 ? data.design.pages.map(p => `- ${p}`).join('\n') : '- Home page'}

### Technical Requirements
- **Framework:** ${data.tech?.framework || 'React with Tailwind CSS'}
- **Approach:** ${data.tech?.responsive?.approach || 'mobile-first'}
- **Structure:** ${data.tech?.output_format?.structure || 'Single page application'}
${data.tech?.output_format?.component_style ? `- **Component Style:** ${data.tech.output_format.component_style}` : ''}
${data.tech?.requirements?.length > 0 ? `- **Requirements:** ${data.tech.requirements.join(', ')}` : ''}
${data.tech?.responsive?.mobile_considerations?.length > 0 ? `- **Mobile:** ${data.tech.responsive.mobile_considerations.join(', ')}` : ''}
${data.tech?.output_format?.include?.length > 0 ? `- **Include:** ${data.tech.output_format.include.join(', ')}` : ''}
${data.tech?.output_format?.exclude?.length > 0 ? `- **Exclude:** ${data.tech.output_format.exclude.join(', ')}` : ''}

### Constraints (DO NOT)
- Maximum ${data.constraints?.max_colors || 4} colors
- Maximum ${data.constraints?.max_fonts || 2} fonts
${data.constraints?.forbidden_patterns?.length > 0 ? `- **Forbidden Patterns:** ${data.constraints.forbidden_patterns.join(', ')}` : ''}
${data.constraints?.forbidden_components?.length > 0 ? `- **Forbidden Components:** ${data.constraints.forbidden_components.join(', ')}` : ''}

### Quality Checklist
${data.quality_assurance?.visual?.length > 0 ? `**Visual:** ${data.quality_assurance.visual.join(' ✓ ')}` : ''}
${data.quality_assurance?.ux?.length > 0 ? `**UX:** ${data.quality_assurance.ux.join(' ✓ ')}` : ''}
${data.quality_assurance?.performance?.length > 0 ? `**Performance:** ${data.quality_assurance.performance.join(' ✓ ')}` : ''}
${data.quality_assurance?.brand?.length > 0 ? `**Brand:** ${data.quality_assurance.brand.join(' ✓ ')}` : ''}

---

${data.quality_assurance?.include_rationale ? '**IMPORTANT:** Before generating code, explain your design decisions and how they align with this brief.\n\n' : ''}Follow the creative process: ${data.agency_mode?.process?.join(' → ') || 'Design → Build → Polish'}

Generate the complete website code now.`;

        // Clean up empty lines
        const cleanedPrompt = promptText.split('\n').filter((line, i, arr) => {
            // Remove lines that are just empty or only contain formatting
            if (line.trim() === '') return i > 0 && arr[i - 1].trim() !== '';
            if (line.trim().startsWith('-') && line.split(':')[1]?.trim() === '') return false;
            return true;
        }).join('\n');

        navigator.clipboard.writeText(cleanedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${data.project_name.toLowerCase().replace(/\s+/g, '_') || 'studio_brief'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // --- Phase Completion Heuristics ---
    const phaseStatus = useMemo(() => {
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

    // --- Question Jump Handler ---
    const handleQuestionJump = (question) => {
        const lowerQ = question.toLowerCase();
        for (const mapping of QUESTION_JUMP_MAP) {
            if (mapping.keywords.some(kw => lowerQ.includes(kw))) {
                setActiveTab(mapping.phase);
                // Scroll to section after phase switch
                setTimeout(() => {
                    const el = document.getElementById(`section-${mapping.section}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
                return;
            }
        }
        // Default: jump to INIT
        setActiveTab('init');
    };

    // --- Compile Brief Handler ---
    const handleCompileBrief = async () => {
        setIsCompiling(true);
        setCompileSuccess(false);
        // Run validation
        try {
            const result = BriefSchema.safeParse(data);
            if (result.success) {
                setValidationStatus('passing');
            } else {
                setValidationStatus('needs_repair');
            }
        } catch {
            setValidationStatus('failed');
        }
        // Animate compiling state
        await new Promise(r => setTimeout(r, 1500));
        copyToClipboard();
        setIsCompiling(false);
        setCompileSuccess(true);
        showToast("Brief compiled and copied!", "success");
        setTimeout(() => setCompileSuccess(false), 3000);
    };

    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showToast("JSON copied to clipboard!", "success");
    };

    // Phase canvas class
    // Phase canvas class - unified to dark mode per user feedback
    const phaseCanvasClass = 'phase-canvas-dark';

    return (
        <div className="flex flex-col md:flex-row h-screen bg-obsidian-900 text-slate-300 font-sans overflow-hidden">

            {/* Hidden file input for JSON import */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
                aria-label="Import JSON file"
            />

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 ${toast.type === "error"
                    ? "bg-red-500/90 text-white"
                    : "bg-green-500/90 text-white"
                    }`}>
                    {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast({ show: false, message: "", type: "error" })}
                        className="ml-2 hover:opacity-70 transition-opacity"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Magic Modal */}
            {showMagicModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="magic-modal-title"
                >
                    <div className="glass-panel border-acid-500/30 rounded-xl w-full max-w-lg p-6 shadow-glow relative">
                        <button
                            onClick={() => setShowMagicModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4 text-acid-500">
                            <Sparkles className="w-6 h-6" aria-hidden="true" />
                            <h2 id="magic-modal-title" className="text-xl font-bold text-white font-display">Hire a Digital Studio</h2>
                        </div>

                        <p className="text-slate-400 mb-6 text-sm">
                            Describe the project (e.g., "A luxury watch landing page"). We will generate a bespoke "Studio Identity" and detailed brief to execute it.
                        </p>

                        <textarea
                            value={magicPrompt}
                            onChange={(e) => setMagicPrompt(e.target.value)}
                            className="w-full bg-obsidian-800 border border-glass-border rounded-lg p-4 text-white focus:ring-1 focus:ring-acid-500 focus:border-acid-500 focus:outline-none min-h-[120px] mb-4"
                            placeholder="What are we building today?"
                            aria-label="Project description"
                        />

                        {magicError && <p className="text-red-400 text-sm mb-4" role="alert">{magicError}</p>}

                        <button
                            onClick={handleMagicGenerate}
                            disabled={isGenerating || !magicPrompt.trim()}
                            aria-busy={isGenerating}
                            className="w-full bg-acid-500 hover:bg-acid-400 text-obsidian-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                    Consulting...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" aria-hidden="true" />
                                    Generate Studio Brief
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <MobileHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowMobileJson={setShowMobileJson}
                clearData={clearData}
                phaseStatus={phaseStatus}
            />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowMagicModal={setShowMagicModal}
                clearData={clearData}
                phaseStatus={phaseStatus}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <CommandHUD data={data} validationStatus={validationStatus} />
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Form Scroll Area */}
                    <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${phaseCanvasClass}`}>
                        <div className="max-w-3xl mx-auto space-y-6 pb-20">

                            {/* Mobile Magic Button (Visible only on mobile) */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setShowMagicModal(true)}
                                    className="w-full bg-acid-500 hover:bg-acid-400 text-obsidian-900 p-3 rounded-lg shadow-glow flex items-center justify-center gap-2 font-bold transition-all"
                                >
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    Auto-Generate Brief
                                </button>
                            </div>

                            {/* Header / Strength Meter */}
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
                                    handleCopyJSON={handleCopyJSON}
                                    downloadJSON={downloadJSON}
                                    handleMagicGenerate={handleMagicGenerate}
                                    setActiveTab={setActiveTab}
                                />
                            )}

                        </div>
                    </div>

                    {/* JSON Preview Sidebar (Desktop) */}
                    <div
                        className={`hidden md:flex bg-obsidian-900 border-l border-glass-border flex-col transition-all duration-300 shrink-0 ${isJsonSidebarOpen ? 'w-96' : 'w-12'
                            }`}
                    >
                        <div className="p-4 border-b border-glass-border flex justify-between items-center h-16">
                            {isJsonSidebarOpen && <h3 className="font-bold text-slate-200 whitespace-nowrap font-display">Live Studio Brief</h3>}
                            <button
                                onClick={() => setIsJsonSidebarOpen(!isJsonSidebarOpen)}
                                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
                            >
                                {isJsonSidebarOpen ? <X className="w-4 h-4 rotate-45" /> : <X className="w-4 h-4 rotate-45" />}
                            </button>
                        </div>

                        {isJsonSidebarOpen && (
                            <>
                                <div className="p-2 border-b border-glass-border flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all bg-white/5 hover:bg-white/10 text-slate-300"
                                        aria-label="Import JSON file"
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
                                    aria-label="Expand JSON panel"
                                >
                                    <X className="w-5 h-5 rotate-45" />
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                                    aria-label="Import JSON"
                                >
                                    <Upload className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={downloadJSON}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                                    aria-label="Export JSON"
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