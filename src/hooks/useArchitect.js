import { useCallback } from 'react';
import useBlueprint from './useBlueprint';
import useToast from './useToast';
import { CURRENT_SCHEMA_VERSION } from '../schemas/brief';

export default function useArchitect() {
    const { setBriefSafely, callGemini, setIsGenerating } = useBlueprint();
    const { showToast } = useToast();

    const handleArchitecturalAnalysis = useCallback(async (analysisData) => {
        setIsGenerating(true);
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
            await setBriefSafely(text, 'architect');
            showToast("Blueprint fully reconstructed from visual analysis!", "success");

        } catch (err) {
            console.error("Architect error:", err);
            showToast("Architect AI failed to reconstruct the blueprint.", "error");
        } finally {
            setIsGenerating(false);
        }
    }, [callGemini, setBriefSafely, showToast, setIsGenerating]);

    return { handleArchitecturalAnalysis };
}
