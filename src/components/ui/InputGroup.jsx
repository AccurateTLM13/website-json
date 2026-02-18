import React from 'react';

const InputGroup = ({ label, children, htmlFor }) => (
    <div className="mb-4 relative">
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-slate-300 mb-2"
        >
            {label}
        </label>
        {children}
    </div>
);

export default InputGroup;