import React, { useState, useEffect } from 'react';
import type { PacienteDTO, CadastroPacienteModel } from '../../types';
import { pacienteService, exclusaoService, authService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import Modal from '../../components/UI/Modal';
import { ChevronLeft, ChevronRight, Trash, Edit, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 40;

const PacienteManagement: React.FC = () => {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteDTO | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        sexo: 'Masculino',
        telefone: '',
        usuarioId: 0,
        email: '',
        senha: ''
    });

    useEffect(() => {
        loadPacientes(currentPage);
    }, [currentPage]);

    const loadPacientes = async (page: number) => {
        try {
            setLoading(true);
            setError('');
            console.log('Carregando pacientes da página:', page, 'com PageSize:', PAGE_SIZE);
            const result = await pacienteService.obterTodos({ 
                PageNumber: page, 
                PageSize: PAGE_SIZE
            });
            console.log('Resultado da API:', result);
            console.log('result.items:', result.items);
            console.log('É array?', Array.isArray(result.items));
            console.log('Total de pacientes na página:', result.items?.length || 0);
            
            // Se result.items existir, usar
            if (result.items && Array.isArray(result.items)) {
                setPacientes(result.items);
            } 
            // Se result for array direto (sem paginação)
            else if (Array.isArray(result)) {
                setPacientes(result);
            }
            // Caso contrário, array vazio
            else {
                console.warn('Formato inesperado de resposta:', result);
                setPacientes([]);
            }
            
            setTotalPages(result.totalPages || 1);
            setHasNext(result.hasNext || false);
            setHasPrevious(result.hasPrevious || false);
        } catch (err: any) {
            console.error('Erro ao carregar pacientes:', err);
            console.error('Detalhes do erro:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data?.message || 'Erro ao carregar lista de pacientes');
            setPacientes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este paciente?')) return;
        
        try {
            console.log('Excluindo paciente com ID:', id);
            await exclusaoService.excluirPaciente(id);
            setSuccess('Paciente excluído com sucesso!');
            loadPacientes(currentPage); // Recarregar todos os dados
        } catch (err: any) {
            console.error('Erro ao excluir paciente:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao excluir paciente');
        }
    };

    const handleEdit = async (paciente: PacienteDTO) => {
        setSelectedPaciente(paciente);
        // Converter data para formato yyyy-MM-dd para o input
        const dataFormatada = paciente.dataNascimento 
            ? new Date(paciente.dataNascimento).toISOString().split('T')[0] 
            : '';
        
        setFormData({
            nome: paciente.nome || '',
            dataNascimento: dataFormatada,
            sexo: paciente.sexo || 'Masculino',
            telefone: paciente.telefone || '',
            usuarioId: paciente.usuarioId || 0
        });
        console.log('Editando paciente:', paciente);
        console.log('FormData preenchido:', {
            nome: paciente.nome,
            dataNascimento: dataFormatada,
            sexo: paciente.sexo,
            telefone: paciente.telefone,
            usuarioId: paciente.usuarioId
        });
        setShowModal(true);
    };



    const handleSubmit = async () => {
        try {
            if (selectedPaciente) {
                // Alteração de paciente existente
                console.log('Alterando paciente ID:', selectedPaciente.id);
                console.log('FormData atual:', formData);
                
                const payload = {
                    id: selectedPaciente.id,
                    nome: formData.nome,
                    dataNascimento: formData.dataNascimento,
                    sexo: formData.sexo,
                    telefone: formData.telefone,
                    usuarioId: formData.usuarioId
                };
                
                console.log('Payload enviado:', payload);
                const result = await pacienteService.alterar(payload as PacienteDTO);
                console.log('Resultado da alteração:', result);
                setSuccess('Paciente atualizado com sucesso!');
            } else {
                // Criação de novo paciente usando endpoint de cadastro
                console.log('Criando novo paciente');
                console.log('FormData:', formData);
                
                const payload: CadastroPacienteModel = {
                    Nome: formData.nome,
                    Email: formData.email,
                    Password: formData.senha,
                    DataNascimento: formData.dataNascimento,
                    Sexo: formData.sexo,
                    Telefone: formData.telefone
                };
                
                console.log('Payload enviado:', payload);
                const result = await authService.registerPaciente(payload);
                console.log('Resultado da criação:', result);
                setSuccess('Paciente criado com sucesso!');
            }
            setShowModal(false);
            loadPacientes(currentPage);
        } catch (err: any) {
            console.error('Erro ao salvar paciente:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao salvar paciente');
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
                            Gerenciamento de Pacientes
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Visualize e gerencie todos os pacientes do sistema
                        </p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedPaciente(null);
                            setFormData({
                                nome: '',
                                dataNascimento: '',
                                sexo: 'Masculino',
                                telefone: '',
                                usuarioId: 0,
                                email: '',
                                senha: ''
                            });
                            setShowModal(true);
                        }}
                    >
                        + Adicionar Paciente
                    </button>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

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
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientes.map((paciente, index) => (
                                        <tr 
                                            key={paciente.id} 
                                            onClick={() => navigate(`/admin/pacientes/${paciente.id}`)}
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
                                            <td style={{ padding: '12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(paciente); }}
                                                        title="Edição rápida"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(paciente.id); }}
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

            {/* Modal de Edição */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={selectedPaciente ? "Editar Paciente" : "Adicionar Paciente"}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>
                        
                        {!selectedPaciente && (
                            <>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.senha}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        
                        <div>
                            <label className="form-label">Data de Nascimento</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.dataNascimento}
                                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Sexo</label>
                            <select
                                className="form-input"
                                value={formData.sexo}
                                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Telefone</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
                                Salvar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal de Visualização */}
            {showViewModal && selectedPaciente && (
                <Modal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    title="Detalhes do Paciente"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><strong>ID:</strong> {selectedPaciente.id}</div>
                        <div><strong>Nome:</strong> {selectedPaciente.nome}</div>
                        <div><strong>Data de Nascimento:</strong> {formatDate(selectedPaciente.dataNascimento)}</div>
                        <div><strong>Sexo:</strong> {selectedPaciente.sexo}</div>
                        <div><strong>Telefone:</strong> {selectedPaciente.telefone || 'Não informado'}</div>
                        <div><strong>ID do Usuário:</strong> {selectedPaciente.usuarioId}</div>
                        {selectedPaciente.consultas && (
                            <div><strong>Número de Consultas:</strong> {selectedPaciente.consultas.length}</div>
                        )}
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowViewModal(false)}
                            style={{ marginTop: '16px' }}
                        >
                            Fechar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PacienteManagement;
