import React, { useState } from 'react';

export default function RecuperarContraseña() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!validateEmail(email)) {
            setError('Por favor, ingresa un correo electrónico válido');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/recuperar-password/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar el correo');
            }

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Ocurrió un error al enviar el correo. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-[50%] p-4 bg-white rounded-xl shadow-lg text-center">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">¡Correo Enviado!</h2>
                    <p className="text-gray-600">
                        Se ha enviado una contraseña provisional a tu correo electrónico.
                        Por favor, revisa tu bandeja de entrada.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[30%] p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Recuperar Contraseña</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Correo Electrónico:
                    </label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        className={`w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 
                            ${error ? 'border-red-500' : 'border-gray-300'}`}
                        required 
                        disabled={isLoading}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                </div>
                <button 
                    type="submit"
                    className={`w-full py-2 text-white rounded-lg transition-colors
                        ${isLoading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
}