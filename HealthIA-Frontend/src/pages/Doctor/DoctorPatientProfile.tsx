import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PacienteDTO, ConsultaPostDTO, UsuarioPostDTO, PaginationParamsConsulta } from '../../types';
import { pacienteService, consultaService, usuarioService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ArrowLeft, User, Calendar, Phone, Mail, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 5;

const DoctorPatientProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
    const [usuario, setUsuario] = useState<UsuarioPostDTO | null>(null);
    const [consultas, setConsultas] = useState<ConsultaPostDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    useEffect(() => {
        loadPaciente();
    }, [id]);

    useEffect(() => {
        if (paciente) {
            loadConsultas(currentPage);
        }
    }, [currentPage, paciente]);

    const loadPaciente = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await pacienteService.obterPorId(parseInt(id));
            setPaciente(data);

            // Buscar email do usuário
            try {
                const usuarioData = await usuarioService.obterPorId(data.usuarioId);
                setUsuario(usuarioData);
            } catch (err) {
                console.error('Erro ao buscar usuário:', err);
            }
        } catch (err: any) {
            console.error('Erro ao carregar paciente:', err);
            setError('Erro ao carregar dados do paciente');
        } finally {
            setLoading(false);
        }
    };

    const loadConsultas = async (page: number) => {
        if (!paciente) return;

        try {
            const result = await consultaService.obterTodos({
                PacienteId: paciente.id,
                PageNumber: page,
                PageSize: PAGE_SIZE
            } as PaginationParamsConsulta);

            setConsultas(result?.items || []);
            setTotalPages(result?.totalPages || 1);
            setHasNext(result?.hasNext || false);
            setHasPrevious(result?.hasPrevious || false);
        } catch (err: any) {
            console.error('Erro ao carregar consultas:', err);
            // Não exibir erro se for apenas porque não há consultas
            setConsultas([]);
            setTotalPages(1);
            setHasNext(false);
            setHasPrevious(false);
        }
    };

    const handleValidar = async (consulta: ConsultaPostDTO) => {
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
            
            console.log('Payload enviado:', payload);
            await consultaService.alterar(payload);

            setSuccess('Consulta validada com sucesso!');
            loadConsultas(currentPage);
        } catch (err: any) {
            console.error('Erro ao validar consulta:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || err.response?.data || 'Erro ao validar consulta');
        }
    };

    const calculateAge = (dateString: string) => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
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
                    Carregando dados do paciente...
                </div>
            </div>
        );
    }

    if (error && !paciente) {
        return (
            <div className="card">
                <Alert type="error" message={error} onClose={() => setError('')} />
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Paciente não encontrado</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/doctor/patients')}
                        style={{ marginTop: '16px' }}
                    >
                        Voltar para Lista de Pacientes
                    </button>
                </div>
            </div>
        );
    }

    if (!paciente) return null;

    return (
        <div>
            {/* Header */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                            className="btn btn-outline" 
                            onClick={() => navigate('/doctor/patients')}
                            style={{ padding: '8px' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="card-title" style={{ margin: 0 }}>Perfil do Paciente</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Visualização e validação de consultas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Informações do Paciente */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <User size={20} />
                    Informações do Paciente
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Nome Completo
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>{paciente.nome}</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <Mail size={16} style={{ display: 'inline', marginRight: '4px' }} />
                            Email
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>{usuario?.email || 'Não disponível'}</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                            Data de Nascimento
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')} ({calculateAge(paciente.dataNascimento)} anos)
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Sexo
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>{paciente.sexo}</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <Phone size={16} style={{ display: 'inline', marginRight: '4px' }} />
                            Telefone
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>{paciente.telefone || 'Não informado'}</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            ID do Paciente
                        </label>
                        <p style={{ margin: 0, fontWeight: 500 }}>#{paciente.id}</p>
                    </div>
                </div>

                {/* Estatísticas */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: 'var(--secondary-color)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary-color)'
                }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                        <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Total de Consultas: <strong>{paciente.consultas?.length || 0}</strong>
                    </p>
                </div>
            </div>

            {/* Consultas do Paciente */}
            <div className="card">
                <h2 className="card-title" style={{ marginBottom: '16px' }}>
                    Histórico de Consultas
                </h2>

                {consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <FileText size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p>Este paciente ainda não possui consultas registradas.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {consultas.map((consulta) => (
                                <div
                                    key={consulta.id}
                                    className="card"
                                    style={{
                                        border: '1px solid #e0e0e0',
                                        backgroundColor: consulta.validacaomedica ? '#f0f9ff' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    Consulta #{consulta.id}
                                                </span>
                                                <StatusBadge validacaomedica={consulta.validacaomedica} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Calendar size={16} />
                                                {formatDate(consulta.dataConsulta)}
                                            </div>
                                        </div>
                                        {!consulta.validacaomedica && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleValidar(consulta)}
                                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                            >
                                                Validar Consulta
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Sintomas:</strong>
                                        <p style={{ marginTop: '4px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                                            {consulta.sintomas}
                                        </p>
                                    </div>

                                    {consulta.diagnosticoIA && (
                                        <div style={{
                                            padding: '12px',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            borderLeft: '3px solid var(--primary-color)'
                                        }}>
                                            <strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Diagnóstico IA:</strong>
                                            <p style={{ marginTop: '4px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                                                {consulta.diagnosticoIA}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div style={{ 
                                marginTop: '24px', 
                                paddingTop: '16px', 
                                borderTop: '1px solid #e0e0e0',
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center'
                            }}>
                                <button 
                                    className="btn btn-outline"
                                    onClick={() => setCurrentPage(p => p - 1)} 
                                    disabled={!hasPrevious}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <ChevronLeft size={18} />
                                    Anterior
                                </button>
                                
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    Página {currentPage} de {totalPages}
                                </span>
                                
                                <button 
                                    className="btn btn-outline"
                                    onClick={() => setCurrentPage(p => p + 1)} 
                                    disabled={!hasNext}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    Próxima
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorPatientProfile;
