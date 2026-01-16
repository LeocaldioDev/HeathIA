import React, { useState, useEffect } from 'react';
import { Activity, ClipboardList, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { medicoService } from '../../services/apiService';
import type { MedicoDTO } from '../../types';

const DoctorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [medico, setMedico] = useState<MedicoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.idElement) {
            loadMedicoData();
        }
    }, [user]);

    const loadMedicoData = async () => {
        try {
            setLoading(true);
            const data = await medicoService.obterPorId(user!.idElement);
            setMedico(data);
        } catch (err) {
            console.error('Erro ao carregar dados do médico:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Cabeçalho com informações do Médico */}
            <div className="card" style={{ marginBottom: '24px', backgroundColor: '#e8f5e9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                        backgroundColor: '#4caf50', 
                        padding: '16px', 
                        borderRadius: '50%', 
                        color: 'white' 
                    }}>
                        <User size={32} />
                    </div>
                    <div>
                        {loading ? (
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Carregando...</h1>
                        ) : medico ? (
                            <>
                                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Bem-vindo, Dr(a). {medico.nome}!</h1>
                                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                    {medico.especialidade || 'Médico'} {medico.crm ? `| CRM: ${medico.crm}` : ''} | {user?.email}
                                </p>
                            </>
                        ) : (
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Painel Médico</h1>
                        )}
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Ações Rápidas
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" onClick={() => navigate('/doctor/results')} style={{ cursor: 'pointer', borderLeft: '4px solid var(--warning-text)' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Pendências</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Validar Resultados</h3>
                            <p className="text-sm">Exames aguardando análise</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--warning-bg)', padding: '12px', borderRadius: '50%', color: 'var(--warning-text)' }}>
                            <ClipboardList size={24} />
                        </div>
                    </div>
                </div>

                <div className="card" onClick={() => navigate('/doctor/patients')} style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary-color)' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Pacientes</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Meus Pacientes</h3>
                            <p className="text-sm">Listagem geral</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--secondary-color)', padding: '12px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                            <Activity size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
