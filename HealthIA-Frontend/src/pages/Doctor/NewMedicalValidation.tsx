import React, { useState, useEffect } from 'react';
import type { ConsultaPostDTO } from '../../types';
import { consultaService } from '../../services/apiService';
import Modal from '../../components/UI/Modal';
import Alert from '../../components/UI/Alert';
import { Check, Eye } from 'lucide-react';

const MedicalValidation: React.FC = () => {
    const [consultas, setConsultas] = useState<ConsultaPostDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedConsulta, setSelectedConsulta] = useState<ConsultaPostDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadConsultas();
    }, []);

    const loadConsultas = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await consultaService.obterTodos({ 
                PageNumber: 1, 
                PageSize: 100 
            });
            console.log('Consultas carregadas:', result);
            setConsultas(result.items || []);
        } catch (err: any) {
            console.error('Erro ao carregar consultas:', err);
            setError(`Erro ao carregar consultas: ${err.message || 'Erro desconhecido'}`);
            setConsultas([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (consulta: ConsultaPostDTO) => {
        setSelectedConsulta(consulta);
        setModalOpen(true);
    };

    const handleValidar = async (consulta: ConsultaPostDTO) => {
        setSubmitting(true);
        try {
            // Enviar apenas campos do ConsultaPostDTO, alterando validacaomedica para true
            const payload = {
                id: consulta.id,
                sintomas: consulta.sintomas,
                diagnosticoIA: consulta.diagnosticoIA || '',
                validacaomedica: true,
                dataConsulta: consulta.dataConsulta,
                pacienteId: consulta.pacienteId
            };

            await consultaService.alterar(payload);
            setSuccess(`Consulta #${consulta.id} validada com sucesso!`);
            loadConsultas();
        } catch (err: any) {
            console.error('Erro ao validar consulta:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || err.response?.data || 'Erro ao processar validação. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const pendentes = consultas.filter(c => !c.validacaomedica);
    const validadas = consultas.filter(c => c.validacaomedica);

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Carregando consultas...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="card">
                <h1 className="card-title">Validação de Consultas IA</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Revise e valide os diagnósticos gerados pela IA
                </p>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {/* Consultas Pendentes */}
                {pendentes.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--warning-text)' }}>
                            Pendentes de Validação ({pendentes.length})
                        </h2>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {pendentes.map((consulta) => (
                                <div
                                    key={consulta.id}
                                    className="card"
                                    style={{ padding: '16px', border: '1px solid var(--warning-bg)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'baseline' }}>
                                                <strong>Consulta #{consulta.id}</strong>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(consulta.dataConsulta).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                {consulta.pacienteNome && (
                                                    <div style={{ fontSize: '0.9rem' }}>
                                                        • Paciente: {consulta.pacienteNome}
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ marginBottom: '12px' }}>
                                                <strong style={{ fontSize: '0.9rem' }}>Sintomas:</strong>
                                                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                                                    {consulta.sintomas.substring(0, 150)}
                                                    {consulta.sintomas.length > 150 && '...'}
                                                </p>
                                            </div>

                                            {consulta.diagnosticoIA && (
                                                <div>
                                                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                                                        Diagnóstico IA:
                                                    </strong>
                                                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                                                        {consulta.diagnosticoIA.substring(0, 150)}
                                                        {consulta.diagnosticoIA.length > 150 && '...'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                onClick={() => openModal(consulta)}
                                            >
                                                <Eye size={16} style={{ marginRight: '4px' }} />
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                onClick={() => handleValidar(consulta)}
                                                disabled={submitting}
                                            >
                                                <Check size={16} style={{ marginRight: '4px' }} />
                                                Validar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Consultas Validadas */}
                {validadas.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--success-text)' }}>
                            Consultas Validadas ({validadas.length})
                        </h2>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {validadas.slice(0, 5).map((consulta) => (
                                <div
                                    key={consulta.id}
                                    className="card"
                                    style={{ padding: '16px', border: '1px solid var(--success-bg)', opacity: 0.7 }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>Consulta #{consulta.id}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {new Date(consulta.dataConsulta).toLocaleDateString('pt-BR')}
                                                {consulta.pacienteNome && ` • ${consulta.pacienteNome}`}
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                            onClick={() => openModal(consulta)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {consultas.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhuma consulta encontrada.
                    </div>
                )}
            </div>

            {/* Modal de Detalhes */}
            {modalOpen && selectedConsulta && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`Consulta #${selectedConsulta.id}`}
                >
                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Data:</strong>
                            <p>{new Date(selectedConsulta.dataConsulta).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>

                        {selectedConsulta.pacienteNome && (
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Paciente:</strong>
                                <p>{selectedConsulta.pacienteNome}</p>
                            </div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <strong>Sintomas:</strong>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {selectedConsulta.sintomas}
                            </p>
                        </div>

                        {selectedConsulta.diagnosticoIA && (
                            <div style={{ marginBottom: '16px' }}>
                                <strong style={{ color: 'var(--primary-color)' }}>Diagnóstico IA:</strong>
                                <div style={{
                                    marginTop: '8px',
                                    padding: '12px',
                                    backgroundColor: 'var(--secondary-color)',
                                    borderRadius: '6px',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}>
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {selectedConsulta.diagnosticoIA}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <strong>Status:</strong>
                            <p>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    backgroundColor: selectedConsulta.validacaomedica ? 'var(--success-bg)' : 'var(--warning-bg)',
                                    color: selectedConsulta.validacaomedica ? 'var(--success-text)' : 'var(--warning-text)'
                                }}>
                                    {selectedConsulta.validacaomedica ? 'Validada' : 'Pendente'}
                                </span>
                            </p>
                        </div>

                        {!selectedConsulta.validacaomedica && (
                            <div style={{ marginTop: '24px' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleValidar(selectedConsulta);
                                        setModalOpen(false);
                                    }}
                                    disabled={submitting}
                                    style={{ width: '100%' }}
                                >
                                    <Check size={16} style={{ marginRight: '8px' }} />
                                    {submitting ? 'Validando...' : 'Validar Consulta'}
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MedicalValidation;
