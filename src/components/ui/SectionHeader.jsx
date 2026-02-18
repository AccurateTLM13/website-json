import React from 'react';

const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
        <div className="p-2 bg-acid-500/10 rounded-lg">
            <Icon className="w-6 h-6 text-acid-500" />
        </div>
        <div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">{title}</h2>
            <p className="text-sm text-slate-400 font-sans">{description}</p>
        </div>
    </div>
);

export default SectionHeader;
