import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ConsultaPostDTO } from '../../types';
import { consultaService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ArrowLeft, Calendar, Stethoscope, ClipboardList, CheckCircle, Clock } from 'lucide-react';

const PatientConsultaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState<ConsultaPostDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadConsulta();
    }, [id]);

    const loadConsulta = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            const data = await consultaService.obterPorId(parseInt(id));
            setConsulta(data);
        } catch (err: any) {
            console.error('Erro ao carregar consulta:', err);
            setError('Erro ao carregar detalhes da consulta');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    Carregando consulta...
                </div>
            </div>
        );
    }

    if (error || !consulta) {
        return (
            <div className="card">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Consulta não encontrada</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/patient/consultas')}
                        style={{ marginTop: '16px' }}
                    >
                        Voltar para Minhas Consultas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                            className="btn btn-outline" 
                            onClick={() => navigate('/patient/consultas')}
                            style={{ padding: '8px' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="card-title" style={{ margin: 0 }}>Detalhes da Consulta</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Consulta #{consulta.id}
                            </p>
                        </div>
                    </div>
                    <StatusBadge 
                        validacaomedica={consulta.validacaomedica}
                    />
                </div>
            </div>

            {/* Informações da Consulta */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Calendar size={20} />
                    Informações da Consulta
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Data da Consulta
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            {formatDate(consulta.dataConsulta)}
                        </p>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Status
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {consulta.validacaomedica ? (
                                <>
                                    <CheckCircle size={16} style={{ color: 'var(--success-text)' }} />
                                    <span style={{ color: 'var(--success-text)', fontWeight: 500 }}>Validada por Médico</span>
                                </>
                            ) : (
                                <>
                                    <Clock size={16} style={{ color: 'var(--warning-text)' }} />
                                    <span style={{ color: 'var(--warning-text)', fontWeight: 500 }}>Aguardando Validação</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sintomas */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ClipboardList size={20} />
                    Sintomas Relatados
                </h2>
                <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--secondary-color)',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                }}>
                    {consulta.sintomas}
                </div>
            </div>

            {/* Diagnóstico IA */}
            {consulta.diagnosticoIA ? (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Stethoscope size={20} />
                        Diagnóstico da Inteligência Artificial
                    </h2>
                    <div style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        borderLeft: '4px solid var(--primary-color)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                    }}>
                        {consulta.diagnosticoIA}
                    </div>
                    
                    {!consulta.validacaomedica && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            backgroundColor: 'var(--warning-bg)',
                            borderRadius: '8px',
                            color: 'var(--warning-text)',
                            fontSize: '0.9rem'
                        }}>
                            <strong>⚠️ Importante:</strong> Este diagnóstico foi gerado por inteligência artificial e ainda não foi validado por um médico. Aguarde a validação médica para confirmação.
                        </div>
                    )}
                    
                    {consulta.validacaomedica && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            backgroundColor: 'var(--success-bg)',
                            borderRadius: '8px',
                            color: 'var(--success-text)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <CheckCircle size={18} />
                            <span><strong>Diagnóstico Validado</strong> - Este diagnóstico foi revisado e aprovado por um médico.</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <Stethoscope size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p>O diagnóstico da IA está sendo processado...</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                            Por favor, volte mais tarde para ver o resultado.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientConsultaDetail;
