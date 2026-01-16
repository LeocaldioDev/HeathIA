import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import { consultaService } from '../../services/apiService';

const DoctorDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        total: 0,
        pendentes: 0,
        validadas: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const result = await consultaService.obterTodos({ PageNumber: 1, PageSize: 1000 });
            const consultas = result.items;
            
            setStats({
                total: consultas.length,
                pendentes: consultas.filter(c => !c.validacaomedica).length,
                validadas: consultas.filter(c => c.validacaomedica).length
            });
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        value: number;
        color: string;
        bgColor: string;
    }> = ({ icon, title, value, color, bgColor }) => (
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: bgColor,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Carregando dashboard...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="card">
                <h1 className="card-title">Dashboard do Médico</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Bem-vindo! Aqui está um resumo das consultas.
                </p>
            </div>

            <div className="card">
                <h2 className="card-title">Ações Rápidas</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="/doctor/consultations" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        Validar Consultas
                    </a>
                    <a href="/doctor/patients" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                        Ver Pacientes
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
