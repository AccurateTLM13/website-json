import React, { useState } from 'react';
import useGemini from '../../hooks/useGemini';
import { Upload, Image as ImageIcon, Loader2, Sparkles, X } from 'lucide-react';

const ImageAnalyzer = ({ onAnalyze }) => {
    const { callGemini } = useGemini(import.meta.env.VITE_GEMINI_API_KEY);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        setError(null);
    };

    const analyzeImage = async () => {
        if (!preview) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Extract base64 data (remove "data:image/xyz;base64," prefix)
            const base64Data = preview.split(',')[1];

            const prompt = `
            Analyze this website screenshot provided. I need you to reverse-engineer the design system and brand strategy that would produce this result.
            
            Return a valid JSON object matching the following structure. Do not wrap in markdown code blocks.
            
            {
               "magic_prompt_summary": "A high-density, director-level summary of the site's entire vibe, strategy, and aesthetic. This should be a standalone paragraph that could be used to instruct another expert designer to recreate this exact feeling. Include notes on target audience, feelings invoked, and specific visual techniques.",
               "brand_narrative": {
                   "essence": "A short phrase capturing the core vibe (e.g., 'Industrial minimalism meets human warmth')",
                   "mission": "Infer the site's mission based on the visuals and content",
                   "target_audience": {
                       "primary_persona": "Who is this site for?",
                       "pain_points": ["Infer 1-2 user pain points this design solves"]
                   }
               },
               "design": {
                   "style": "Keywords describing the visual style (e.g., Brutalist, Swiss Style, Corporate Memphis)",
                   "colors": ["Extract 3-5 dominant hex codes"],
                   "typography": {
                       "heading_style": "Description of heading font (e.g., 'Bold Serif, high contrast')",
                       "body_style": "Description of body font (e.g., 'Clean Sans-serif, open spacing')"
                   },
                   "imagery": {
                       "style": "Description of how images are treated (e.g., 'Black and white, grainy, full-bleed')"
                   },
                   "interactions": {
                       "effects": ["Infer likely interactions (e.g., 'Subtle hover lift', 'Parallax scroll')"]
                   }
               },
               "content": {
                   "headline_style": "Describe the copywriting style of headlines",
                   "tone_examples": ["Give 1-2 examples of the tone of voice used"]
               }
            }
            `;

            const result = await callGemini(prompt, base64Data);

            // Clean the result in case Gemini wraps it in markdown
            let cleanedResult = result.trim();
            if (cleanedResult.startsWith('```json')) {
                cleanedResult = cleanedResult.replace(/^```json/, '').replace(/```$/, '');
            } else if (cleanedResult.startsWith('```')) {
                cleanedResult = cleanedResult.replace(/^```/, '').replace(/```$/, '');
            }

            const jsonResult = JSON.parse(cleanedResult);
            onAnalyze(jsonResult);

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to analyze image. Please try again. " + err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-obsidian-900/50 border border-glass-border rounded-xl p-4 mb-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-acid-400" />
                AI Visual Analysis
            </h3>

            {!preview ? (
                <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-6 transition-colors hover:border-acid-500/50 hover:bg-slate-800/20 group relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-acid-400 transition-colors">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-mono">Upload Screenshot to Reverse Engineer</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-glass-border bg-black/50 aspect-video flex items-center justify-center">
                        <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="w-full py-2 px-4 bg-gradient-to-r from-acid-500 to-emerald-500 text-black font-bold uppercase tracking-wider text-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing Visuals...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Extract Design System
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
                            Error: {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzer;
