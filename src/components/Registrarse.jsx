import React, { useState } from 'react';

export default function FormRegistro() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        fechaNac: '',
        direccion: '',
        username: '',
        password: '',
        correoRecuperacion: '',
        tipoSuscripcion: 'SEMANAL'
    });

    const formatDataForAPI = (formData) => {
        return {
            nombre: formData.nombre,
            apellido: formData.apellido,
            fechaNac: formData.fechaNac,
            direccion: formData.direccion,
            rolId: 2, // Cliente rol
            cuenta: {
                username: formData.username,
                password: formData.password,
                correoRecuperacion: formData.correoRecuperacion
            },
            suscripcion: {
                create: {
                    tipo: formData.tipoSuscripcion
                }
            }
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = formatDataForAPI(formData);
            console.log('Formatted data:', formattedData); // Para debug

            const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="w-[75%] p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Registrarse</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Apellido:</label>
                    <input 
                        type="text" 
                        name="apellido" 
                        value={formData.apellido} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
                    <input 
                        type="date" 
                        name="fechaNac" 
                        value={formData.fechaNac} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Dirección:</label>
                    <input 
                        type="text" 
                        name="direccion" 
                        value={formData.direccion} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Correo de Recuperación:</label>
                    <input 
                        type="email" 
                        name="correoRecuperacion" 
                        value={formData.correoRecuperacion} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Tipo de Suscripción:</label>
                    <select 
                        name="tipoSuscripcion" 
                        value={formData.tipoSuscripcion} 
                        onChange={handleChange}
                        className="w-full py-1.5 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="SEMANAL">SEMANAL</option>
                        <option value="MENSUAL">MENSUAL</option>
                        <option value="TRIMESTRAL">TRIMESTRAL</option>
                        <option value="SEMESTRAL">SEMESTRAL</option>
                        <option value="ANUAL">ANUAL</option>
                    </select>
                </div>

                <button 
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}