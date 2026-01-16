import React, { useState, useEffect } from 'react';
import type { ConsultaDTO } from '../../types';
import { consultaService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ChevronLeft, ChevronRight, Trash, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 5;

const ConsultaManagement: React.FC = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState<ConsultaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    useEffect(() => {
        loadConsultas(currentPage);
    }, [currentPage]);

    const loadConsultas = async (page: number) => {
        try {
            setLoading(true);
            const result = await consultaService.obterTodos({ 
                PageNumber: page, 
                PageSize: PAGE_SIZE 
            });
            setConsultas(result.items);
            setTotalPages(result.totalPages);
            setHasNext(result.hasNext);
            setHasPrevious(result.hasPrevious);
        } catch (err: any) {
            console.error('Erro ao carregar consultas:', err);
            setError('Erro ao carregar lista de consultas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir esta consulta?')) return;
        
        try {
            await consultaService.excluir(id);
            setSuccess('Consulta excluída com sucesso!');
            loadConsultas(currentPage);
        } catch (err: any) {
            console.error('Erro ao excluir consulta:', err);
            setError('Erro ao excluir consulta');
        }
    };



    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
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
                        <h1 className="card-title" style={{ margin: 0 }}>
                            <FileText size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                            Gerenciamento de Consultas
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Visualize e gerencie todas as consultas do sistema
                        </p>
                    </div>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {loading && consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
                ) : consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhuma consulta encontrada.
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Paciente</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Médico</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Data</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Validação</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consultas.map((consulta, index) => (
                                        <tr 
                                            key={consulta.id} 
                                            onClick={() => navigate(`/admin/consultas/${consulta.id}`)}
                                            style={{ 
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9f9f9'}
                                        >
                                            <td style={{ padding: '12px' }}>{consulta.id}</td>
                                            <td style={{ padding: '12px' }}>{consulta.paciente?.nome || `ID: ${consulta.pacienteId}`}</td>
                                            <td style={{ padding: '12px' }}>{consulta.medico?.nome || consulta.medicoId ? `ID: ${consulta.medicoId}` : 'Não atribuído'}</td>
                                            <td style={{ padding: '12px' }}>{formatDate(consulta.dataConsulta)}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <StatusBadge validacaomedica={consulta.validacaomedica} />
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(consulta.id); }}
                                                        title="Excluir"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div style={{ 
                                marginTop: '24px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    Página {currentPage} de {totalPages}
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-outline"
                                        disabled={!hasPrevious}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        style={{ padding: '8px 16px', opacity: !hasPrevious ? 0.5 : 1 }}
                                    >
                                        <ChevronLeft size={16} /> Anterior
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        disabled={!hasNext}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        style={{ padding: '8px 16px', opacity: !hasNext ? 0.5 : 1 }}
                                    >
                                        Próxima <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ConsultaManagement;
