import React, { useState, useEffect } from 'react';
import type { AdminDTO, CadastroAdminModel } from '../../types';
import { adminService, exclusaoService, authService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import Modal from '../../components/UI/Modal';
import { ChevronLeft, ChevronRight, Trash, Edit, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 5;

const AdminManagement: React.FC = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState<AdminDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminDTO | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        cargo: '',
        usuarioId: 0,
        email: '',
        senha: ''
    });

    useEffect(() => {
        loadAdmins(currentPage);
    }, [currentPage]);

    const loadAdmins = async (page: number) => {
        try {
            setLoading(true);
            setError('');
            console.log('Carregando admins da página:', page, 'com PageSize:', PAGE_SIZE);
            const result = await adminService.obterTodos({ 
                PageNumber: page, 
                PageSize: PAGE_SIZE
            });
            console.log('Resultado da API:', result);
            console.log('result.items:', result.items);
            console.log('É array?', Array.isArray(result.items));
            console.log('Total de admins na página:', result.items?.length || 0);
            
            // Se result.items existir, usar
            if (result.items && Array.isArray(result.items)) {
                setAdmins(result.items);
            } 
            // Se result for array direto (sem paginação)
            else if (Array.isArray(result)) {
                setAdmins(result);
            }
            // Caso contrário, array vazio
            else {
                console.warn('Formato inesperado de resposta:', result);
                setAdmins([]);
            }
            
            setTotalPages(result.totalPages || 1);
            setHasNext(result.hasNext || false);
            setHasPrevious(result.hasPrevious || false);
        } catch (err: any) {
            console.error('Erro ao carregar admins:', err);
            console.error('Detalhes do erro:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data?.message || 'Erro ao carregar lista de administradores');
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este administrador?')) return;
        
        try {
            console.log('Excluindo administrador com ID:', id);
            await exclusaoService.excluirAdmin(id);
            setSuccess('Administrador excluído com sucesso!');
            loadAdmins(currentPage);
        } catch (err: any) {
            console.error('Erro ao excluir admin:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao excluir administrador');
        }
    };

    const handleEdit = (admin: AdminDTO) => {
        setSelectedAdmin(admin);
        setFormData({
            nome: admin.nome,
            cargo: admin.cargo || '',
            usuarioId: admin.usuarioId
        });
        setShowModal(true);
    };



    const handleSubmit = async () => {
        try {
            if (selectedAdmin) {
                // Alteração de admin existente
                console.log('Alterando administrador:', selectedAdmin.id);
                const payload = {
                    id: selectedAdmin.id,
                    nome: formData.nome,
                    cargo: formData.cargo,
                    usuarioId: formData.usuarioId
                };
                console.log('Payload enviado:', payload);
                const result = await adminService.alterar(payload as AdminDTO);
                console.log('Resultado:', result);
                setSuccess('Administrador atualizado com sucesso!');
            } else {
                // Criação de novo admin usando endpoint de cadastro
                console.log('Criando novo administrador');
                const payload: CadastroAdminModel = {
                    Nome: formData.nome,
                    Email: formData.email,
                    Password: formData.senha
                };
                console.log('Payload enviado:', payload);
                const result = await authService.registerAdmin(payload);
                console.log('Resultado:', result);
                setSuccess('Administrador criado com sucesso!');
            }
            setShowModal(false);
            loadAdmins(currentPage);
        } catch (err: any) {
            console.error('Erro ao salvar admin:', err);
            console.error('Detalhes do erro:', err.response?.data);
            setError(err.response?.data?.message || 'Erro ao salvar administrador');
        }
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 className="card-title" style={{ margin: 0 }}>
                            <Shield size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                            Gerenciamento de Administradores
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Visualize e gerencie todos os administradores do sistema
                        </p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedAdmin(null);
                            setFormData({
                                nome: '',
                                cargo: '',
                                usuarioId: 0,
                                email: '',
                                senha: ''
                            });
                            setShowModal(true);
                        }}
                    >
                        + Adicionar Admin
                    </button>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                {loading && admins.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
                ) : admins.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Nenhum administrador encontrado.
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Nome</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Cargo</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>ID Usuário</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin, index) => (
                                        <tr 
                                            key={admin.id} 
                                            onClick={() => navigate(`/admin/admins/${admin.id}`)}
                                            style={{ 
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9f9f9'}
                                        >
                                            <td style={{ padding: '12px' }}>{admin.id}</td>
                                            <td style={{ padding: '12px' }}>{admin.nome}</td>
                                            <td style={{ padding: '12px' }}>{admin.cargo || '-'}</td>
                                            <td style={{ padding: '12px' }}>{admin.usuarioId}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(admin); }}
                                                        title="Edição rápida"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '6px 10px' }}
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(admin.id); }}
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
                    title={selectedAdmin ? "Editar Administrador" : "Adicionar Administrador"}
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
                        
                        {!selectedAdmin && (
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
                            <label className="form-label">Cargo</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.cargo}
                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
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
            {showViewModal && selectedAdmin && (
                <Modal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    title="Detalhes do Administrador"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><strong>ID:</strong> {selectedAdmin.id}</div>
                        <div><strong>Nome:</strong> {selectedAdmin.nome}</div>
                        <div><strong>Cargo:</strong> {selectedAdmin.cargo || 'Não informado'}</div>
                        <div><strong>ID do Usuário:</strong> {selectedAdmin.usuarioId}</div>
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

export default AdminManagement;
