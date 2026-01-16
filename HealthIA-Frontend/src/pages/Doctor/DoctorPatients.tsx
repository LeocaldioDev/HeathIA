import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PacienteDTO } from '../../types';
import { pacienteService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const PAGE_SIZE = 40;

const DoctorPatients: React.FC = () => {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    useEffect(() => {
        loadPacientes(currentPage);
    }, [currentPage]);

    const loadPacientes = async (page: number) => {
        try {
            setLoading(true);
            const result = await pacienteService.obterTodos({ 
                PageNumber: page, 
                PageSize: PAGE_SIZE 
            });
            setPacientes(result.items);
            setTotalPages(result.totalPages);
            setHasNext(result.hasNext);
            setHasPrevious(result.hasPrevious);
        } catch (err: any) {
            console.error('Erro ao carregar pacientes:', err);
            setError('Erro ao carregar lista de pacientes');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 className="card-title" style={{ margin: 0 }}>
                            <User size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                            Lista de Pacientes
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Visualize todos os pacientes registrados no sistema
                        </p>
                    </div>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                {loading && pacientes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
                ) : pacientes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhum paciente encontrado.
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Nome</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Nascimento</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Sexo</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Telefone</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Consultas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientes.map((paciente, index) => (
                                        <tr 
                                            key={paciente.id} 
                                            onClick={() => navigate(`/doctor/patients/${paciente.id}`)}
                                            style={{ 
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9f9f9'}
                                        >
                                            <td style={{ padding: '12px' }}>{paciente.id}</td>
                                            <td style={{ padding: '12px' }}>{paciente.nome}</td>
                                            <td style={{ padding: '12px' }}>{formatDate(paciente.dataNascimento)}</td>
                                            <td style={{ padding: '12px' }}>{paciente.sexo}</td>
                                            <td style={{ padding: '12px' }}>{paciente.telefone || '-'}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    backgroundColor: 'var(--secondary-color)',
                                                    color: 'var(--primary-color)'
                                                }}>
                                                    {paciente.consultas?.length || 0}
                                                </span>
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

export default DoctorPatients;
