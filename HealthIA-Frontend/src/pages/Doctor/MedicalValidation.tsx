import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import type { MedicalResultDTO } from '../../types';
import { Check, X, Activity } from 'lucide-react';

const MedicalValidation: React.FC = () => {
    const [results, setResults] = useState<MedicalResultDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Mocking endpoint for unverified results or all results
            // In real app: /Api/Resultado?status=NaoVerificado
            const response = await api.get('/Api/Resultado');
            console.log(response.data);
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching results", error);
            // Fallback for demo if API doesn't exist yet
            setResults([
                { id: '1', pacienteNome: 'João Silva', dataExame: '2025-12-24', conteudeIA: 'Risco moderado de hipertensão detectado com base nos biomarcadores.', status: 'NaoVerificado' },
                { id: '2', pacienteNome: 'Maria Souza', dataExame: '2025-12-25', conteudeIA: 'Sem anomalias detectadas. Sinais vitais dentro da normalidade.', status: 'NaoVerificado' }
            ] as any);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleValidation = async (id: string, newStatus: 'Aprovado' | 'Reprovado') => {
        try {
            // Mock API call
            // await api.put(`/Api/Resultado/${id}/status`, { status: newStatus });

            // Optimistic update
            setResults(results.map(r => r.id === id ? { ...r, status: newStatus } : r));
            // alert(`Resultado ${newStatus} com sucesso.`);
        } catch (error) {
            console.error("Error updating status", error);
            alert("Erro ao atualizar status.");
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Validação Médica de Resultados IA</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <p>Carregando exames...</p>
                ) : results.length === 0 ? (
                    <p>Nenhum resultado pendente.</p>
                ) : (
                    results.map((result) => (
                        <div key={result.id} className="card" style={{ borderLeft: `4px solid ${result.status === 'NaoVerificado' ? 'var(--warning-text)' : result.status === 'Aprovado' ? 'var(--success-text)' : 'var(--error-text)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Paciente: {result.pacienteNome}</h3>
                                        <span className={`status-badge ${result.status === 'Aprovado' ? 'status-verified' : result.status === 'NaoVerificado' ? 'status-unverified' : ''}`}
                                            style={{ backgroundColor: result.status === 'Reprovado' ? 'var(--error-bg)' : undefined, color: result.status === 'Reprovado' ? 'var(--error-text)' : undefined }}>
                                            {result.status === 'NaoVerificado' ? 'Aguardando Validação' : result.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted">Data: {new Date(result.dataExame).toLocaleDateString()}</p>

                                    <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginTop: '16px', border: '1px solid #e0e0e0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6a1b9a' }}>
                                            <Activity size={16} />
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Análise Preliminar da IA</span>
                                        </div>
                                        <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>"{result.conteudoIA}"</p>
                                    </div>
                                </div>

                                {result.status === 'NaoVerificado' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: 'var(--success-text)', color: 'white' }}
                                            onClick={() => handleValidation(result.id, 'Aprovado')}
                                        >
                                            <Check size={16} style={{ marginRight: '8px' }} />
                                            Aprovar
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: 'var(--error-text)', color: 'white' }}
                                            onClick={() => handleValidation(result.id, 'Reprovado')}
                                        >
                                            <X size={16} style={{ marginRight: '8px' }} />
                                            Reprovar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicalValidation;
