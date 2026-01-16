import React, { useState, useEffect } from 'react';
import type { MedicoDTO, CadastroMedicoModel } from '../../types';
import { medicoService, exclusaoService, authService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import Modal from '../../components/UI/Modal';
import { ChevronLeft, ChevronRight, Trash, Edit, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 5;

const MedicoManagement: React.FC = () => {
    const navigate = useNavigate();
    const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedMedico, setSelectedMedico] = useState<MedicoDTO | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: '',
        usuarioId: 0,
        email: '',
        senha: ''
    });

    useEffect(() => {
        loadMedicos(currentPage);
    }, [currentPage]);

    const loadMedicos = async (page: number) => {
        try {
            setLoading(true);
            setError('');
            console.log('Carregando médicos da página:', page, 'com PageSize:', PAGE_SIZE);
            const result = await medicoService.obterTodos({ 
                PageNumber: page, 
                PageSize: PAGE_SIZE
            });
            console.log('Resultado da API:', result);
            console.log('result.items:', result.items);
            console.log('É array?', Array.isArray(result.items));
            console.log('Total de médicos na página:', result.items?.length || 0);
            
            // Se result.items existir, usar
            if (result.items && Array.isArray(result.items)) {
                setMedicos(result.items);
            } 
            // Se result for array direto (sem paginação)
            else if (Array.isArray(result)) {
                setMedicos(result);
            }
            // Caso contrário, array vazio
            else {
                console.warn('Formato inesperado de resposta:', result);
                setMedicos([]);
            }
            
            setTotalPages(result.totalPages || 1);
            setHasNext(result.hasNext || false);
            setHasPrevious(result.hasPrevious || false);
        } catch (err: any) {
            console.error('Erro ao carregar médicos:', err);
            console.error('Detalhes do erro:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data?.message || 'Erro ao carregar lista de médicos');
            setMedicos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este médico?')) return;
        
        try {
            console.log('Excluindo médico com ID:', id);
            await exclusaoService.excluirMedico(id);
            setSuccess('Médico excluído com sucesso!');
            loadMedicos(currentPage);
        } catch (err: any) {
            console.error('Erro ao excluir médico:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao excluir médico');
        }
    };

    const handleEdit = (medico: MedicoDTO) => {
        setSelectedMedico(medico);
        setFormData({
            nome: medico.nome,
            crm: medico.crm || '',
            especialidade: medico.especialidade || '',
            telefone: medico.telefone || '',
            usuarioId: medico.usuarioId
        });
        setShowModal(true);
    };



    const handleSubmit = async () => {
        try {
            if (selectedMedico) {
                // Alteração de médico existente
                console.log('Alterando médico:', selectedMedico.id);
                const payload = {
                    id: selectedMedico.id,
                    nome: formData.nome,
                    crm: formData.crm,
                    especialidade: formData.especialidade,
                    telefone: formData.telefone,
                    usuarioId: formData.usuarioId
                };
                
                console.log('Payload enviado:', payload);
                const result = await medicoService.alterar(payload as MedicoDTO);
                console.log('Resultado:', result);
                setSuccess('Médico atualizado com sucesso!');
            } else {
                // Criação de novo médico usando endpoint de cadastro
                console.log('Criando novo médico');
                const payload: CadastroMedicoModel = {
                    Nome: formData.nome,
                    Email: formData.email,
                    Password: formData.senha
                };
                
                console.log('Payload enviado:', payload);
                const result = await authService.registerMedico(payload);
                console.log('Resultado:', result);
                setSuccess('Médico criado com sucesso!');
            }
            setShowModal(false);
            loadMedicos(currentPage);
        } catch (err: any) {
            console.error('Erro ao salvar médico:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao salvar médico');
        }
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 className="card-title" style={{ margin: 0 }}>
                            <Stethoscope size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                            Gerenciamento de Médicos
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Visualize e gerencie todos os médicos do sistema
                        </p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedMedico(null);
                            setFormData({
                                nome: '',
                                crm: '',
                                especialidade: '',
                                telefone: '',
                                usuarioId: 0,
                                email: '',
                                senha: ''
                            });
                            setShowModal(true);
                        }}
                    >
                        + Adicionar Médico
                    </button>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {loading && medicos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
                ) : medicos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhum médico encontrado.
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Nome</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>CRM</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Especialidade</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Telefone</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicos.map((medico, index) => (
                                        <tr 
                                            key={medico.id} 
                                            onClick={() => navigate(`/admin/medicos/${medico.id}`)}
                                            style={{ 
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9f9f9'}
                                        >
                                            <td style={{ padding: '12px' }}>{medico.id}</td>
                                            <td style={{ padding: '12px' }}>{medico.nome}</td>
                                            <td style={{ padding: '12px' }}>{medico.crm}</td>
                                            <td style={{ padding: '12px' }}>{medico.especialidade}</td>
                                            <td style={{ padding: '12px' }}>{medico.telefone || '-'}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(medico); }}
                                                        title="Edição rápida"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(medico.id); }}
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
                    title={selectedMedico ? "Editar Médico" : "Adicionar Médico"}
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
                        
                        {!selectedMedico && (
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
                            <label className="form-label">CRM</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.crm}
                                onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Especialidade</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.especialidade}
                                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                            />
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
            {showViewModal && selectedMedico && (
                <Modal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    title="Detalhes do Médico"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><strong>ID:</strong> {selectedMedico.id}</div>
                        <div><strong>Nome:</strong> {selectedMedico.nome}</div>
                        <div><strong>CRM:</strong> {selectedMedico.crm}</div>
                        <div><strong>Especialidade:</strong> {selectedMedico.especialidade}</div>
                        <div><strong>Telefone:</strong> {selectedMedico.telefone || 'Não informado'}</div>
                        <div><strong>ID do Usuário:</strong> {selectedMedico.usuarioId}</div>
                        {selectedMedico.consultas && (
                            <div><strong>Consultas Realizadas:</strong> {selectedMedico.consultas.length}</div>
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

export default MedicoManagement;
