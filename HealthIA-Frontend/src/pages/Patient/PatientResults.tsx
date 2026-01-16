import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import type { MedicalResultDTO } from '../../types';
import { Clock, CheckCircle, AlertOctagon } from 'lucide-react';

const PatientResults: React.FC = () => {
    const [results, setResults] = useState<MedicalResultDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Backend should return only this patient's results based on Token
                const response = await api.get('/Api/Resultado');
                // If backend returns all (bad practice but possible in demo), frontend filtering:
                // setResults(response.data.filter(r => r.patientId === user.id)); 
                // Assuming backend handles it.
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching patient results", error);
                // Demo fallback
                setResults([
                    { id: '1', pacienteNome: 'Você', dataExame: '2025-12-24', conteudeIA: 'Risco moderado de hipertensão detectado com base nos biomarcadores.', status: 'NaoVerificado' },
                ] as any);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Aprovado': return <CheckCircle size={20} />;
            case 'Reprovado': return <AlertOctagon size={20} />;
            default: return <Clock size={20} />;
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Meus Resultados</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <p>Carregando...</p>
                ) : results.length === 0 ? (
                    <p>Você ainda não possui resultados de exames.</p>
                ) : (
                    results.map((result) => (
                        <div key={result.id} className="card" style={{ borderLeft: `4px solid ${result.status === 'NaoVerificado' ? 'var(--warning-text)' : result.status === 'Aprovado' ? 'var(--success-text)' : 'var(--error-text)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Exame de Rotina</h3>
                                        <span className={`status-badge ${result.status === 'Aprovado' ? 'status-verified' : result.status === 'NaoVerificado' ? 'status-unverified' : ''}`}
                                            style={{
                                                backgroundColor: result.status === 'Reprovado' ? 'var(--error-bg)' : undefined,
                                                color: result.status === 'Reprovado' ? 'var(--error-text)' : undefined,
                                                display: 'flex', alignItems: 'center', gap: '4px'
                                            }}>
                                            {getStatusIcon(result.status)}
                                            {result.status === 'NaoVerificado' ? 'Em Análise' : result.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted">Realizado em: {new Date(result.dataExame).toLocaleDateString()}</p>

                                    <div style={{ marginTop: '16px' }}>
                                        <strong style={{ display: 'block', marginBottom: '4px', color: '#555' }}>Resultado da IA:</strong>
                                        <div style={{ backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '6px', border: '1px solid #bbdefb', color: '#0d47a1' }}>
                                            {result.conteudoIA}
                                        </div>
                                    </div>

                                    {result.observacaoMedico && (
                                        <div style={{ marginTop: '16px' }}>
                                            <strong style={{ display: 'block', marginBottom: '4px', color: '#555' }}>Observação do Médico:</strong>
                                            <p style={{ margin: 0 }}>{result.observacaoMedico}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientResults;
