import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService, medicoService, pacienteService } from '../../services/apiService';
import { LogOut, LayoutDashboard, Users, User, FileText, Activity, Stethoscope, Shield } from 'lucide-react';

const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        if (user?.idElement) {
            loadUserName();
        }
    }, [user]);

    const loadUserName = async () => {
        try {
            if (user?.role === 1) { // Admin
                const admin = await adminService.obterPorId(user.idElement);
                setUserName(admin.nome);
            } else if (user?.role === 2) { // Médico
                const medico = await medicoService.obterPorId(user.idElement);
                setUserName(medico.nome);
            } else if (user?.role === 3) { // Paciente
                const paciente = await pacienteService.obterPorId(user.idElement);
                setUserName(paciente.nome);
            }
        } catch (err) {
            console.error('Erro ao carregar nome do usuário:', err);
            setUserName(user?.email || '');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Define navigation items based on role
    const getNavItems = () => {
        const role = user?.role;
        const items = [];

        if (role === 1) { // Admin
            items.push({ path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> });
            items.push({ path: '/admin/pacientes', label: 'Pacientes', icon: <User size={20} /> });
            items.push({ path: '/admin/medicos', label: 'Médicos', icon: <Stethoscope size={20} /> });
            items.push({ path: '/admin/admins', label: 'Admins', icon: <Shield size={20} /> });
            items.push({ path: `/admin/admins/${user?.idElement}`, label: 'Meu Perfil', icon: <User size={20} /> });
        } else if (role === 2) { // Medico
            items.push({ path: '/doctor', label: 'Dashboard', icon: <LayoutDashboard size={20} /> });
            items.push({ path: '/doctor/patients', label: 'Pacientes', icon: <User size={20} /> });
            items.push({ path: '/doctor/profile', label: 'Perfil', icon: <User size={20} /> });
        } else if (role === 3) { // Paciente
            items.push({ path: '/patient', label: 'Nova Consulta', icon: <Activity size={20} /> });
            items.push({ path: '/patient/consultas', label: 'Minhas Consultas', icon: <FileText size={20} /> });
            items.push({ path: '/patient/profile', label: 'Perfil', icon: <User size={20} /> });
        }

        return items;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: 'white',
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Activity color="var(--primary-color)" />
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>HealthIA</span>
                </div>

                <nav style={{ padding: '20px', flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {getNavItems().map((item) => (
                            <li key={item.path} style={{ marginBottom: '8px' }}>
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        backgroundColor: isActive ? 'var(--secondary-color)' : 'transparent',
                                        fontWeight: isActive ? 600 : 500
                                    })}
                                    end={item.path !== '/admin' && item.path !== '/doctor'} // Exact match for sub-routes logic if needed
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 600 }}>{userName || user?.email}</div>
                        <div className="text-sm text-muted">{user?.roleName}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: 'var(--bg-color)', overflowY: 'auto' }}>
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Painel do {user?.roleName}</h2>
                </header>
                <div style={{ padding: '24px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
