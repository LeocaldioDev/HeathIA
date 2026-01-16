import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConsultaDTO } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const PAGE_SIZE = 4;

const PatientConsultas: React.FC = () => {
    const navigate = useNavigate();
    const { consultas: allConsultas, refreshPacienteData } = useAuth();
    const [error, setError] = useState('');
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 className="card-title" style={{ margin: 0 }}>Minhas Consultas</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            {totalCount} consulta{totalCount !== 1 ? 's' : ''} no total
                        </p>
                    </div>
                    <a href="/patient" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        Nova Consulta
                    </a>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                {consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                        <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>Você ainda não realizou nenhuma consulta.</p>
                        <a href="/patient" className="btn btn-primary" style={{ marginTop: '16px', textDecoration: 'none' }}>
                            Fazer sua primeira consulta
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Tabela de Consultas */}
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Sintomas</th>
                                        <th>Diagnóstico IA</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consultas.map((consulta) => (
                                        <tr
                                            key={consulta.id}
                                            onClick={() => navigate(`/patient/consultas/${consulta.id}`)}
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--secondary-color)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={16} style={{ color: 'var(--primary-color)' }} />
                                                    {formatDate(consulta.dataConsulta)}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{
                                                    maxWidth: '300px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {consulta.sintomas}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{
                                                    maxWidth: '300px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {consulta.diagnosticoIA || 'Em análise...'}
                                                </div>
                                            </td>
                                            <td>
                                                <StatusBadge 
                                                    validacaomedica={consulta.validacaomedica}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
                    </>
                )}
            </div>
        </div>
    );
};

export default PatientConsultas;
