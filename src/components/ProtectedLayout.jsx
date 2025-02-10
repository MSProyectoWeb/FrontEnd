import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedLayout = ({ allowedRoles, children }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Si no hay usuario, redirige al login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Verifica el rol
    if (!allowedRoles.includes(user.rolId)) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>; // Si está autorizado, renderiza las rutas hijas
};
