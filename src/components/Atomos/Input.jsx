import React from "react";

export default function Input({ label, type = "text", placeholder, className = "", id, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-principal mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={`w-full p-[14px] border-[1.5px] border-texto-secundario rounded-xl ${className}`}
                
                {...props}
            />
        </div>
    );
}
