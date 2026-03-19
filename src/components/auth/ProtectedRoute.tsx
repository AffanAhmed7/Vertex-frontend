import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'CUSTOMER' | 'ADMIN';
}

/**
 * Route guard that redirects unauthenticated users to the homepage.
 * If requiredRole is specified, only users with that role (or higher) can access.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const location = useLocation();

    // Not logged in → redirect to home
    if (!currentUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Requires ADMIN role but user is not ADMIN
    if (requiredRole === 'ADMIN' && currentUser.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    // Requires CUSTOMER role but user is not CUSTOMER (e.g. an ADMIN trying to see user profile)
    if (requiredRole === 'CUSTOMER' && currentUser.role !== 'CUSTOMER') {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
