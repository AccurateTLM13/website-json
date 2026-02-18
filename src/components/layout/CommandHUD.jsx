import React from 'react';
import { Shield, Activity, Zap, Clock } from 'lucide-react';

const CommandHUD = ({ data, validationStatus }) => {
    const schemaVersion = data?.schema_version || '2.0.0';
    const meta = data?.meta || {};

    const statusConfig = {
        passing: { label: 'PASSING', color: 'text-green-400', bg: 'bg-green-500/10', ring: 'ring-green-500/20' },
        needs_repair: { label: 'NEEDS REPAIR', color: 'text-yellow-400', bg: 'bg-yellow-500/10', ring: 'ring-yellow-500/20' },
        failed: { label: 'FAILED', color: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/20' },
    };

    const status = statusConfig[validationStatus] || statusConfig.passing;

    const modeLabel = meta.source === 'magic' ? 'Magic'
        : meta.source === 'architect' ? 'Architect'
            : 'Manual';

    const generatedAt = meta.generated_at
        ? new Date(meta.generated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-obsidian-950 border-b border-glass-border text-[11px] font-mono uppercase tracking-wider select-none shrink-0 overflow-x-auto" id="command-hud">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03]">
                <Shield className="w-3 h-3 text-slate-500" aria-hidden="true" />
                <span className="text-slate-500">Schema</span>
                <span className="text-slate-300 font-bold">{schemaVersion}</span>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded ring-1 ${status.bg} ${status.ring}`}>
                <Activity className="w-3 h-3" aria-hidden="true" />
                <span className={status.color}>{status.label}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03]">
                <Zap className="w-3 h-3 text-acid-500" aria-hidden="true" />
                <span className="text-slate-500">Mode</span>
                <span className="text-slate-300">{modeLabel}</span>
            </div>

            {generatedAt && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03]">
                    <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                    <span className="text-slate-500">{generatedAt}</span>
                </div>
            )}
        </div>
    );
};

export default CommandHUD;
