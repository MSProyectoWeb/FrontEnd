import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TarjetaUsuario() {
    const [userData, setUserData] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (!userString || !token) {
            setError('No se encontró información del usuario');
            setIsLoading(false);
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(userString);
            setUserData(user);
            await fetchUserSubscription(user.id, token);
        } catch (error) {
            setError('Error al cargar los datos');
            if (error.message === 'Token inválido') {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserSubscription = async (userId, token) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL_SERVER}/subscriptions/user/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 401) {
                throw new Error('Token inválido');
            }

            if (!response.ok) {
                throw new Error('Error al obtener la suscripción');
            }
            
            const data = await response.json();
            setSubscription(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener la suscripción');
            if (error.message === 'Token inválido') {
                // Limpiar localStorage y redirigir al login
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                throw error;
            }
        }
    };

    if (!userData) return null;

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white w-full shadow-sm">
            <div className="text-5xl">👤</div>

            <div className="text-center space-y-2">
                <h2 className="text-xl font-medium">
                    {userData.nombre} {userData.apellido}
                </h2>
                <p className="text-gray-600 text-sm">
                    Fecha de nacimiento: {formatDate(userData.fechaNac)}
                </p>
                <p className="text-gray-600 text-sm">
                    Rol: {userData.rolId === 2 ? 'Miembro' : 'Administrador'}
                </p>
            </div>

            {subscription && (
                <div className="text-center space-y-2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                        {subscription.tipo}
                    </span>
                    <p className="text-sm text-gray-500">
                        Expira: {formatDate(subscription.fechaFin)}
                    </p>
                    <p className="text-sm text-gray-500">
                        Creada: {formatDate(subscription.fechaCreacion)}
                    </p>
                </div>
            )}

            {!subscription && (
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">
                    Sin suscripción activa
                </span>
            )}

            {isLoading && (
                <div className="animate-pulse space-y-4 w-full">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}