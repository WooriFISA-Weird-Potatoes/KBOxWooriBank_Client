import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = ({ user }) => {
    useEffect(() => {
        const isLoggedIn = Boolean(user);
        if (isLoggedIn === false) {
            <Navigate to="/login" />;
        }
    }, [user]);

    return <Outlet />;
};

export default PrivateRoutes;