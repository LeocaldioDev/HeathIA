import React, { useState, useEffect } from 'react';
import { Users, Activity, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/apiService';
import type { AdminDTO } from '../../types';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [admin, setAdmin] = useState<AdminDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.idElement) {
            loadAdminData();
        }
    }, [user]);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const data = await adminService.obterPorId(user!.idElement);
            setAdmin(data);
        } catch (err) {
            console.error('Erro ao carregar dados do admin:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Cabeçalho com informações do Admin */}
            <div className="card" style={{ marginBottom: '24px', backgroundColor: '#e3f2fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                        backgroundColor: 'var(--primary-color)', 
                        padding: '16px', 
                        borderRadius: '50%', 
                        color: 'white' 
                    }}>
                        <User size={32} />
                    </div>
                    <div>
                        {loading ? (
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Carregando...</h1>
                        ) : admin ? (
                            <>
                                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Bem-vindo, {admin.nome}!</h1>
                                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                    {admin.cargo || 'Administrador'} | {user?.email}
                                </p>
                            </>
                        ) : (
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Dashboard Administrativo</h1>
                        )}
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Gestão do Sistema
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" onClick={() => navigate('/admin/pacientes')} style={{ cursor: 'pointer', borderLeft: '4px solid #2196f3' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Gerenciar</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Pacientes</h3>
                            <p className="text-sm">Visualizar e gerenciar</p>
                        </div>
                        <div style={{ backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '50%', color: '#2196f3' }}>
                            <User size={24} />
                        </div>
                    </div>
                </div>

                <div className="card" onClick={() => navigate('/admin/medicos')} style={{ cursor: 'pointer', borderLeft: '4px solid #4caf50' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Gerenciar</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Médicos</h3>
                            <p className="text-sm">Visualizar e gerenciar</p>
                        </div>
                        <div style={{ backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '50%', color: '#4caf50' }}>
                            <Activity size={24} />
                        </div>
                    </div>
                </div>

                <div className="card" onClick={() => navigate('/admin/admins')} style={{ cursor: 'pointer', borderLeft: '4px solid #ff9800' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Gerenciar</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Administradores</h3>
                            <p className="text-sm">Visualizar e gerenciar</p>
                        </div>
                        <div style={{ backgroundColor: '#fff3e0', padding: '12px', borderRadius: '50%', color: '#ff9800' }}>
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
