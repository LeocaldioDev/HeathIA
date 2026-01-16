import React, { useState, useEffect } from 'react';
import { FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pacienteService } from '../../services/apiService';
import type { PacienteDTO } from '../../types';

const PatientHome: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.idElement) {
            loadPaciente();
        }
    }, [user]);

    const loadPaciente = async () => {
        try {
            setLoading(true);
            const data = await pacienteService.obterPorId(user!.idElement);
            setPaciente(data);
        } catch (err) {
            console.error('Erro ao carregar dados do paciente:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
                {loading ? 'Carregando...' : paciente ? `Olá, ${paciente.nome}!` : `Olá, ${user?.email}`}
            </h1>

            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>Meus Dados</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '50%', color: '#1565c0' }}>
                        <User size={32} />
                    </div>
                    <div>
                        {paciente ? (
                            <>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{paciente.nome}</p>
                                <p style={{ margin: 0 }} className="text-muted">{user?.email} | Perfil: Paciente</p>
                            </>
                        ) : (
                            <>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{user?.email}</p>
                                <p style={{ margin: 0 }} className="text-muted">Perfil: Paciente</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" onClick={() => navigate('/patient/results')} style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary-color)' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ margin: 0 }}>Saúde</p>
                            <h3 style={{ margin: '5px 0', fontSize: '1.2rem' }}>Meus Exames</h3>
                            <p className="text-sm">Verificar resultados</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--secondary-color)', padding: '12px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                            <FileText size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;
