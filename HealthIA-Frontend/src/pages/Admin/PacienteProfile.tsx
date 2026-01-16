import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PacienteDTO, ConsultaDTO, PaginationParamsConsulta } from '../../types';
import { pacienteService, consultaService, exclusaoService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import StatusBadge from '../../components/UI/StatusBadge';
import { ArrowLeft, Save, Trash, User, Calendar, Phone, FileText, ChevronLeft, ChevronRight, Edit, X } from 'lucide-react';

const PAGE_SIZE = 5;

const PacienteProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<PacienteDTO | null>(null);
    const [consultas, setConsultas] = useState<ConsultaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    // Paginação de consultas
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        sexo: 'Masculino',
        telefone: ''
    });

    useEffect(() => {
        if (id) {
            loadPaciente(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadConsultas(currentPage);
        }
    }, [currentPage, id]);

    const loadPaciente = async (pacienteId: number) => {
        try {
            setLoading(true);
            const data = await pacienteService.obterPorId(pacienteId);
            setPaciente(data);
            setFormData({
                nome: data.nome,
                dataNascimento: data.dataNascimento.split('T')[0],
                sexo: data.sexo,
                telefone: data.telefone || ''
            });
        } catch (err: any) {
            console.error('Erro ao carregar paciente:', err);
            setError('Erro ao carregar dados do paciente');
        } finally {
            setLoading(false);
        }
    };

    const loadConsultas = async (page: number) => {
        if (!id) return;
        
        try {
            const result = await consultaService.obterTodos({
                PacienteId: parseInt(id),
                PageNumber: page,
                PageSize: PAGE_SIZE
            } as PaginationParamsConsulta);
            
            setConsultas((result?.items as ConsultaDTO[]) || []);
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

    const handleSave = async () => {
        if (!paciente) return;

        try {
            setSaving(true);
            await pacienteService.alterar({
                ...paciente,
                nome: formData.nome,
                dataNascimento: formData.dataNascimento,
                sexo: formData.sexo,
                telefone: formData.telefone
            });
            setSuccess('Paciente atualizado com sucesso!');
            setEditMode(false);
            loadPaciente(paciente.id);
        } catch (err: any) {
            console.error('Erro ao salvar:', err);
            setError('Erro ao salvar alterações');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        if (paciente) {
            setFormData({
                nome: paciente.nome,
                dataNascimento: paciente.dataNascimento.split('T')[0],
                sexo: paciente.sexo,
                telefone: paciente.telefone || ''
            });
        }
    };

    const handleDelete = async () => {
        if (!paciente) return;
        if (!window.confirm(`Tem certeza que deseja excluir o paciente ${paciente.nome}?`)) return;

        try {
            await exclusaoService.excluirPaciente(paciente.id);
            setSuccess('Paciente excluído com sucesso!');
            setTimeout(() => navigate('/admin/pacientes'), 1500);
        } catch (err: any) {
            console.error('Erro ao excluir:', err);
            setError('Erro ao excluir paciente');
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

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Paciente não encontrado
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header com botão Voltar e Excluir */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    className="btn btn-outline"
                    onClick={() => navigate('/admin/pacientes')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Voltar
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Trash size={18} /> Excluir Paciente
                </button>
            </div>

            {/* Card do Perfil com Avatar */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--secondary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        {paciente.nome.charAt(0).toUpperCase()}
                    </div>

                    {/* Info e Ações */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '1.75rem', 
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '4px'
                        }}>
                            {paciente.nome}
                        </h1>
                        <p style={{ 
                            margin: 0, 
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem'
                        }}>
                            {paciente.email} • {paciente.sexo} • {calculateAge(paciente.dataNascimento)} anos
                        </p>
                    </div>

                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {editMode ? (
                            <>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Save size={18} /> {saving ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <X size={18} /> Cancelar
                                </button>
                            </>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handleEdit}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Edit size={18} /> Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Card de Dados Pessoais */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <User size={24} />
                    Dados Pessoais
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'var(--text-primary)'
                        }}>
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'var(--text-primary)'
                        }}>
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.dataNascimento}
                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'var(--text-primary)'
                        }}>
                            Sexo
                        </label>
                        <select
                            className="form-input"
                            value={formData.sexo}
                            onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        >
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'var(--text-primary)'
                        }}>
                            Telefone
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="(00) 00000-0000"
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Consultas do Paciente */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={22} />
                    Consultas do Paciente
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Histórico de todas as consultas realizadas
                </p>

                {consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhuma consulta encontrada para este paciente.
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {consultas.map((consulta) => (
                                <div
                                    key={consulta.id}
                                    className="card"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    onClick={() => navigate(`/admin/consultas/${consulta.id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                Consulta #{consulta.id}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {formatDate(consulta.dataConsulta)}
                                            </div>
                                        </div>
                                        <StatusBadge validacaomedica={consulta.validacaomedica} />
                                    </div>
                                    
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>Sintomas:</strong>
                                        <p style={{ 
                                            marginTop: '6px', 
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {consulta.sintomas}
                                        </p>
                                    </div>
                                </div>
                            ))}
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

export default PacienteProfile;
