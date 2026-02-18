import React from 'react';
import { Gauge } from 'lucide-react';

const StrengthMeter = ({ data }) => {
    const calculateStrength = () => {
        let score = 0;
        const totalWeight = 25; // Total key fields for comprehensive brief

        // Identity (4 points)
        if (data.project_name) score++;
        if (data.agency_mode?.studio_name) score++;
        if (data.agency_mode?.creative_director?.length > 20) score++;
        if (data.agency_mode?.process?.length > 0) score++;

        // Audience & Narrative (5 points)
        if (data.brand_narrative?.target_audience?.primary_persona) score++;
        if (data.brand_narrative?.target_audience?.pain_points?.length > 0) score++;
        if (data.brand_narrative?.essence) score++;
        if (data.brand_narrative?.mission) score++;
        if (data.brand_narrative?.experience?.hero) score++;

        // Content (3 points)
        if (data.content?.headline_style) score++;
        if (data.content?.cta_examples?.length > 0) score++;
        if (data.content?.tone_examples?.length > 0) score++;

        // Design (6 points)
        if (data.design?.style) score++;
        if (data.design?.colors?.length > 0) score++;
        if (data.design?.typography?.heading_style) score++;
        if (data.design?.imagery?.style) score++;
        if (data.design?.interactions?.effects?.length > 0) score++;
        if (data.design?.pages?.length > 0) score++;

        // Tech (3 points)
        if (data.tech?.framework) score++;
        if (data.tech?.output_format?.structure) score++;
        if (data.tech?.responsive?.mobile_considerations?.length > 0) score++;

        // Constraints (2 points)
        if (data.constraints?.forbidden_patterns?.length > 0) score++;
        if (data.constraints?.forbidden_components?.length > 0) score++;

        // QA (2 points)
        const qaFields = [data.quality_assurance?.visual, data.quality_assurance?.ux, data.quality_assurance?.performance, data.quality_assurance?.brand];
        const filledQa = qaFields.filter(arr => arr?.length > 0).length;
        if (filledQa >= 2) score++;
        if (filledQa >= 4) score++;

        return Math.min(100, Math.round((score / totalWeight) * 100));
    };

    const strength = calculateStrength();

    let color = "bg-red-500";
    let label = "Sketchy";
    if (strength > 25) { color = "bg-orange-500"; label = "Basic"; }
    if (strength > 50) { color = "bg-yellow-500"; label = "Solid"; }
    if (strength > 75) { color = "bg-acid-400"; label = "Robust"; }
    if (strength >= 90) { color = "bg-acid-500"; label = "Bespoke"; }

    return (
        <div className="flex items-center gap-3 bg-obsidian-900/50 py-2 px-4 rounded-full border border-glass-border w-fit backdrop-blur-sm">
            <Gauge className={`w-4 h-4 ${strength >= 90 ? 'text-acid-500 animate-pulse' : 'text-slate-500'}`} aria-hidden="true" />
            <div className="flex flex-col w-24 md:w-32">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1 font-mono">
                    <span>{label}</span>
                    <span aria-label={`Brief completeness: ${strength}%`}>{strength}%</span>
                </div>
                <div className="h-1.5 w-full bg-obsidian-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={strength} aria-valuemin="0" aria-valuemax="100">
                    <div
                        className={`h-full transition-all duration-500 ${color} ${strength >= 90 ? 'shadow-[0_0_10px_rgba(204,255,0,0.5)]' : ''}`}
                        style={{ width: `${strength}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StrengthMeter;
