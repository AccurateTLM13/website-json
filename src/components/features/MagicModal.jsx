import React, { useState } from 'react';
import { Sparkles, X, Loader2, Wand2 } from 'lucide-react';
import useGemini from '../../hooks/useGemini';
import useBlueprint from '../../hooks/useBlueprint';
import useToast from '../../hooks/useToast';
import { CURRENT_SCHEMA_VERSION } from '../../schemas/brief';

export default function MagicModal({ isOpen, onClose }) {
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState("");
    const { setBriefSafely, setIsGenerating, isGenerating, callGemini } = useBlueprint();
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError("");

        const systemPrompt = `
You are a Creative Director at a top-tier digital design agency.
Generate a comprehensive JSON blueprint for: "${prompt}".

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
            await setBriefSafely(text, 'magic');
            showToast("Blueprint generated successfully!", "success");
            setPrompt("");
            onClose();
        } catch (err) {
            setError("Failed to generate blueprint. Please try again.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="magic-modal-title"
        >
            <div className="glass-panel border-acid-500/30 rounded-xl w-full max-w-lg p-6 shadow-glow relative">
                <button
                    onClick={onClose}
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
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-obsidian-800 border border-glass-border rounded-lg p-4 text-white focus:ring-1 focus:ring-acid-500 focus:border-acid-500 focus:outline-none min-h-[120px] mb-4"
                    placeholder="What are we building today?"
                    aria-label="Project description"
                />

                {error && <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>}

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
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
    );
}
