import React from 'react';

const Card = ({ children, className = "" }) => (
    <div className={`glass-panel rounded-xl p-6 ${className}`}>
        {children}
    </div>
);

export default Card;
