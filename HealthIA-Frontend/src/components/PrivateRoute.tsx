import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const PrivateRoute: React.FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based access control
    const path = location.pathname;

    // Check if user is accessing the correct area based on their role
    const isAdminRoute = path.startsWith('/admin');
    const isDoctorRoute = path.startsWith('/doctor');
    const isPatientRoute = path.startsWith('/patient');

    const isAdmin = user.role === UserRole.Admin;
    const isDoctor = user.role === UserRole.Medico;
    const isPatient = user.role === UserRole.Paciente;

    // Redirect to appropriate dashboard if accessing wrong area
    if (isAdminRoute && !isAdmin) {
        if (isDoctor) return <Navigate to="/doctor" replace />;
        if (isPatient) return <Navigate to="/patient" replace />;
    }

    if (isDoctorRoute && !isDoctor) {
        if (isAdmin) return <Navigate to="/admin" replace />;
        if (isPatient) return <Navigate to="/patient" replace />;
    }

    if (isPatientRoute && !isPatient) {
        if (isAdmin) return <Navigate to="/admin" replace />;
        if (isDoctor) return <Navigate to="/doctor" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
