import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Error en el inicio de sesión');
            return;
        }

        // Guardamos el token y los datos del usuario
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
            
        // Redirigimos según el rol
        if (data.user.rolId === 1) {
            navigate('/dashboard');
        } else if (data.user.rolId === 2) {
            navigate('/app');
        }
        
    } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión. Intente nuevamente.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">BIENVENIDO</h1>
          <p className="text-gray-600">Ingresa tus datos</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block font-medium text-gray-900">
              C.I o Email
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium text-gray-900">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition duration-200"
          >
            Ingresar
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-orange-500 hover:text-orange-600 font-medium">
              Regístrate aquí
            </Link>
          </p>
          <p className="text-gray-600">
            ¿Olvidaste tu contraseña?{' '}
            <Link to="/recuperarContraseña" className="text-orange-500 hover:text-orange-600 font-medium">
              Recupera tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}