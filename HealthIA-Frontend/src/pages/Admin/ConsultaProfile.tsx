import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ConsultaDTO } from '../../types';
import { consultaService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ArrowLeft, Trash, FileText, User, Calendar, Stethoscope, CheckCircle, XCircle } from 'lucide-react';

const ConsultaProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState<ConsultaDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) {
            loadConsulta(parseInt(id));
        }
    }, [id]);

    const loadConsulta = async (consultaId: number) => {
        try {
            setLoading(true);
            const data = await consultaService.obterPorId(consultaId);
            setConsulta(data);
        } catch (err: any) {
            console.error('Erro ao carregar consulta:', err);
            setError('Erro ao carregar dados da consulta');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!consulta) return;
        if (!window.confirm(`Tem certeza que deseja excluir a consulta #${consulta.id}?`)) return;

        try {
            await consultaService.excluir(consulta.id);
            setSuccess('Consulta excluída com sucesso!');
            setTimeout(() => navigate('/admin/consultas'), 1500);
        } catch (err: any) {
            console.error('Erro ao excluir:', err);
            setError('Erro ao excluir consulta');
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
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            </div>
        );
    }

    if (!consulta) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Consulta não encontrada
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    className="btn btn-outline"
                    onClick={() => navigate(-1)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Voltar
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Trash size={18} /> Excluir Consulta
                </button>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Informações da Consulta */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                    <div>
                        <h1 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FileText size={24} />
                            Consulta #{consulta.id}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                            {formatDate(consulta.dataConsulta)}
                        </p>
                    </div>
                    <StatusBadge validacaomedica={consulta.validacaomedica} />
                </div>

                {/* Informações do Paciente */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <User size={18} style={{ color: 'var(--primary-color)' }} />
                        <strong>Informações do Paciente</strong>
                    </div>
                    <div style={{ marginLeft: '26px', color: 'var(--text-secondary)' }}>
                        <div><strong>Nome:</strong> {consulta.paciente?.nome || 'Não disponível'}</div>
                        <div><strong>ID do Paciente:</strong> {consulta.pacienteId}</div>
                    </div>
                </div>

                {/* Informações do Médico */}
                {consulta.medicoId && (
                    <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#f0f8ff', 
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Stethoscope size={18} style={{ color: 'var(--primary-color)' }} />
                            <strong>Médico Responsável</strong>
                        </div>
                        <div style={{ marginLeft: '26px', color: 'var(--text-secondary)' }}>
                            <div><strong>Nome:</strong> {consulta.medico?.nome || 'Não disponível'}</div>
                            <div><strong>ID do Médico:</strong> {consulta.medicoId}</div>
                        </div>
                    </div>
                )}

                {/* Sintomas */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <FileText size={18} style={{ color: 'var(--primary-color)' }} />
                        <strong>Sintomas Relatados</strong>
                    </div>
                    <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#fff3cd', 
                        borderRadius: '8px',
                        borderLeft: '4px solid #ffc107',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                    }}>
                        {consulta.sintomas}
                    </div>
                </div>

                {/* Diagnóstico IA */}
                {consulta.diagnosticoIA && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <FileText size={18} style={{ color: 'var(--primary-color)' }} />
                            <strong>Diagnóstico da IA</strong>
                        </div>
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#e3f2fd', 
                            borderRadius: '8px',
                            borderLeft: '4px solid #2196f3',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6'
                        }}>
                            {consulta.diagnosticoIA}
                        </div>
                    </div>
                )}

                {/* Resposta IA (se houver) */}
                {consulta.respostaIA && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <FileText size={18} style={{ color: 'var(--primary-color)' }} />
                            <strong>Resposta da IA</strong>
                        </div>
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#f3e5f5', 
                            borderRadius: '8px',
                            borderLeft: '4px solid #9c27b0',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6'
                        }}>
                            {consulta.respostaIA}
                        </div>
                    </div>
                )}

                {/* Observações do Médico */}
                {consulta.observacoesMedico && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Stethoscope size={18} style={{ color: 'var(--primary-color)' }} />
                            <strong>Observações do Médico</strong>
                        </div>
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#e8f5e9', 
                            borderRadius: '8px',
                            borderLeft: '4px solid #4caf50',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6'
                        }}>
                            {consulta.observacoesMedico}
                        </div>
                    </div>
                )}

                {/* Status de Validação */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: consulta.validacaomedica ? '#d4edda' : '#fff3cd',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${consulta.validacaomedica ? '#28a745' : '#ffc107'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {consulta.validacaomedica ? (
                        <CheckCircle size={24} style={{ color: '#28a745' }} />
                    ) : (
                        <XCircle size={24} style={{ color: '#ffc107' }} />
                    )}
                    <div>
                        <strong style={{ color: consulta.validacaomedica ? '#155724' : '#856404' }}>
                            {consulta.validacaomedica ? 'Consulta Validada' : 'Aguardando Validação Médica'}
                        </strong>
                        <p style={{ 
                            margin: '4px 0 0 0', 
                            fontSize: '0.9rem',
                            color: consulta.validacaomedica ? '#155724' : '#856404'
                        }}>
                            {consulta.validacaomedica 
                                ? 'Esta consulta foi revisada e validada por um médico.' 
                                : 'Esta consulta ainda não foi validada por um profissional de saúde.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultaProfile;
