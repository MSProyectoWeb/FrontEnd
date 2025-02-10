import { lazy, Fragment, Suspense } from 'react';
import { Route, Outlet } from 'react-router-dom';
import { ProtectedLayout } from '../components/ProtectedLayout';

// Define las rutas
export const routes = [
    {
        path: "/",
        layout: () => import('../layouts/FirstLayout'),
        children: [
            {
                index: true, // Ruta predeterminada para "/"
                path: "login", // Ruta exacta
                element: () => import('../pages/Login'),
            },
            {
                path: "registro",
                element: () => import('../pages/Registro.jsx'),
            },
            {
                path: "recuperarContraseña",
                children: [
                    {
                        index: true, // Ruta predeterminada para "/recuperarContraseña"
                        element: () => import('../pages/RecuperarContraseña.jsx'),
                    },
                ],
            },
        ],
    },
    {
        path: "/app",
        layout: () => import('../layouts/MainLayoutNoHeader'),
        guard: ProtectedLayout, // Usamos ProtectedLayout para proteger las rutas de /app
        allowedRoles: [1,2], // Asume que 1 y 2 son roles válidos para acceder a /app
        children: [
            {
                index: true, // Ruta predeterminada para "/app"
                element: () => import('../pages/InicioUsuario'),
            },
        ],
    },

    {
        path: "/dashboard",
        layout: () => import('../layouts/MainLayoutNoHeader'),
        guard: ProtectedLayout, // Usamos ProtectedLayout para proteger las rutas de /app
        allowedRoles: [1], // Asume que 1 y 2 son roles válidos para acceder a /app
        children: [
            {
                index: true,
                element: () => import('../pages/Dashboard.jsx'),
            },
        ],
    },
];

export const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        const Component = route.element ? lazy(() => route.element()) : Fragment;
        const Layout = route.layout ? lazy(() => route.layout()) : Fragment;
        const Guard = route.guard ? route.guard : Fragment; // Usar el Guard si está definido
        const allowedRoles = route.allowedRoles || []; // Obtener los roles permitidos, si los hay

        return (
            <Route
                key={index}
                path={route.path}
                index={route.index || undefined} // Manejo de rutas predeterminadas
                element={
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <Guard allowedRoles={allowedRoles}> {/* Pasamos allowedRoles al Guard */}
                            <Layout>
                                {route.children ? <Outlet /> : <Component />}
                            </Layout>
                        </Guard>
                    </Suspense>
                }
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        );
    });
};

export default renderRoutes;
