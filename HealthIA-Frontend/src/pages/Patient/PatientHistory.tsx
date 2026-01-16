import React, { useState, useMemo } from 'react';
import type { ConsultaDTO } from '../../types';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/UI/StatusBadge';
import Alert from '../../components/UI/Alert';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 4;

const PatientHistory: React.FC = () => {
    const { consultas: allConsultas } = useAuth();
    const [error, setError] = useState('');
    const [selectedConsulta, setSelectedConsulta] = useState<ConsultaDTO | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Paginação local das consultas armazenadas no contexto
    const totalCount = allConsultas.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const hasNext = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    // Ordenar consultas por data (mais recentes primeiro) e paginar
    const consultas = useMemo(() => {
        const sorted = [...allConsultas].sort((a, b) => 
            new Date(b.dataConsulta).getTime() - new Date(a.dataConsulta).getTime()
        );
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return sorted.slice(startIndex, startIndex + PAGE_SIZE) as ConsultaDTO[];
    }, [allConsultas, currentPage]);

    return (
        <div>
            <div className="card">
                <h1 className="card-title">Histórico de Consultas</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Visualize todas as suas consultas e diagnósticos
                </p>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                {consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Você ainda não possui consultas registradas.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {consultas.map((consulta) => (
                            <div
                                key={consulta.id}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: selectedConsulta?.id === consulta.id ? '2px solid var(--primary-color)' : '1px solid #e0e0e0'
                                }}
                                onClick={() => setSelectedConsulta(consulta.id === selectedConsulta?.id ? null : consulta)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {new Date(consulta.dataConsulta).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div style={{ fontWeight: 600, marginTop: '4px' }}>
                                            Consulta #{consulta.id}
                                        </div>
                                    </div>
                                    <StatusBadge validada={consulta.validacaomedica} />
                                </div>

                                {selectedConsulta?.id === consulta.id && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <strong style={{ color: 'var(--primary-color)' }}>Sintomas:</strong>
                                            <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                                {consulta.sintomas}
                                            </p>
                                        </div>

                                        {consulta.diagnosticoIA && (
                                            <div style={{ marginBottom: '16px' }}>
                                                <strong style={{ color: 'var(--primary-color)' }}>Diagnóstico IA:</strong>
                                                <div style={{
                                                    marginTop: '8px',
                                                    padding: '12px',
                                                    backgroundColor: 'var(--secondary-color)',
                                                    borderRadius: '6px',
                                                    whiteSpace: 'pre-wrap',
                                                    lineHeight: '1.6'
                                                }}>
                                                    {consulta.diagnosticoIA}
                                                </div>
                                            </div>
                                        )}

                                        {!consulta.validacaomedica && (
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '12px',
                                                backgroundColor: 'var(--warning-bg)',
                                                borderRadius: '6px',
                                                color: 'var(--warning-text)',
                                                fontSize: '0.9rem'
                                            }}>
                                                <strong>Aguardando validação médica</strong>
                                                <p style={{ margin: '4px 0 0 0' }}>
                                                    Esta consulta ainda não foi validada por um médico.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Paginação */}
                        <div style={{ 
                            marginTop: '24px', 
                            paddingTop: '16px',
                            borderTop: '1px solid #e0e0e0',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setCurrentPage(1)} 
                                disabled={currentPage === 1}
                                style={{ padding: '8px 12px', minWidth: 'auto' }}
                            >
                                «
                            </button>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setCurrentPage(p => p - 1)} 
                                disabled={!hasPrevious}
                                style={{ padding: '8px 12px', minWidth: 'auto' }}
                            >
                                ‹
                            </button>
                            
                            {/* Números das páginas */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={page === currentPage ? "btn btn-primary" : "btn btn-outline"}
                                    onClick={() => setCurrentPage(page)}
                                    style={{ 
                                        padding: '8px 14px', 
                                        minWidth: '40px',
                                        fontWeight: page === currentPage ? 'bold' : 'normal'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button 
                                className="btn btn-outline"
                                onClick={() => setCurrentPage(p => p + 1)} 
                                disabled={!hasNext}
                                style={{ padding: '8px 12px', minWidth: 'auto' }}
                            >
                                ›
                            </button>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setCurrentPage(totalPages)} 
                                disabled={currentPage === totalPages}
                                style={{ padding: '8px 12px', minWidth: 'auto' }}
                            >
                                »
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Mostrando {consultas.length} de {totalCount} consultas
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;
