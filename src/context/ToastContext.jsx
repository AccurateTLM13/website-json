import React, { createContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ show: false, message: "", type: "error" });

    const showToast = useCallback((message, type = "error") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "error" }), 4000);
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 ${toast.type === "error"
                    ? "bg-red-500/90 text-white"
                    : toast.type === "warning"
                        ? "bg-yellow-500/90 text-white"
                        : "bg-green-500/90 text-white"
                    }`}>
                    {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={hideToast}
                        className="ml-2 hover:opacity-70 transition-opacity"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
}
