import React, { useEffect, useState } from 'react';
import { usuarioService, cadastroService } from '../../services/apiService';
import type { UsuarioDTO } from '../../types';
import { Plus, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserRole } from '../../types';
import Alert from '../../components/UI/Alert';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UsuarioDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ 
        nome: '', 
        email: '', 
        senha: '', 
        telefone: '',
        role: UserRole.Paciente 
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const PAGE_SIZE = 5;

    const fetchUsers = async (pageNumber: number) => {
        setLoading(true);
        setError('');
        try {
            const result = await usuarioService.obterTodos({ PageNumber: pageNumber, PageSize: PAGE_SIZE });
            setUsers(result.items);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
            setHasNext(result.hasNext);
            setHasPrevious(result.hasPrevious);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setError('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await usuarioService.excluir(id);
                setSuccess('Usuário excluído com sucesso!');
                fetchUsers(currentPage);
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                setError('Erro ao excluir usuário');
            }
        }
    };

    const getRoleName = (role: UserRole): string => {
        switch (role) {
            case UserRole.Admin: return 'Admin';
            case UserRole.Medico: return 'Médico';
            case UserRole.Paciente: return 'Paciente';
            default: return 'Desconhecido';
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            // Usar endpoint correto baseado no role
            if (newUser.role === UserRole.Admin) {
                await cadastroService.cadastrarAdmin({
                    Nome: newUser.nome,
                    Email: newUser.email,
                    Password: newUser.senha
                });
            } else if (newUser.role === UserRole.Medico) {
                await cadastroService.cadastrarMedico({
                    Nome: newUser.nome,
                    Email: newUser.email,
                    Password: newUser.senha
                });
            } else {
                await cadastroService.cadastrarPaciente({
                    Nome: newUser.nome,
                    Email: newUser.email,
                    Telefone: newUser.telefone,
                    DataNascimento: new Date().toISOString(),
                    Sexo: "Masculino",
                    Password: newUser.senha
                });
            }
            
            setShowModal(false);
            setNewUser({ nome: '', email: '', senha: '', telefone: '', role: UserRole.Paciente });
            setSuccess('Usuário criado com sucesso!');
            fetchUsers(currentPage);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            setError('Erro ao criar usuário. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Gerenciamento de Usuários</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Novo Usuário
                </button>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Nome</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Perfil</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Carregando...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Nenhum usuário encontrado.</td></tr>
                        ) : (
                            users.map((u) => {
                                const roleName = getRoleName(u.role);
                                const nome = u.paciente?.nome || u.medico?.nome || u.admin?.nome || 'N/A';
                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '16px' }}>{nome}</td>
                                        <td style={{ padding: '16px' }}>{u.email}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span className="badge" style={{
                                                backgroundColor: u.role === UserRole.Admin ? '#e3f2fd' : u.role === UserRole.Medico ? '#e8f5e9' : '#fff3e0',
                                                color: u.role === UserRole.Admin ? '#1565c0' : u.role === UserRole.Medico ? '#2e7d32' : '#e65100'
                                            }}>
                                                {roleName}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                                onClick={() => handleDelete(u.id)}
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e0e0e0' }}>
                        <button
                            className="btn btn-outline"
                            disabled={!hasPrevious}
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={{ padding: '8px 12px', opacity: !hasPrevious ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="btn btn-outline"
                            disabled={!hasNext}
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{ padding: '8px 12px', opacity: !hasNext ? 0.5 : 1 }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', margin: 0 }}>
                        <h2 style={{ marginTop: 0 }}>Novo Usuário</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="label">Nome Completo *</label>
                                <input 
                                    className="input" 
                                    required 
                                    value={newUser.nome} 
                                    onChange={e => setNewUser({ ...newUser, nome: e.target.value })} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Email *</label>
                                <input 
                                    className="input" 
                                    type="email" 
                                    required 
                                    value={newUser.email} 
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Senha *</label>
                                <input 
                                    className="input" 
                                    type="password" 
                                    required 
                                    minLength={6}
                                    value={newUser.senha} 
                                    onChange={e => setNewUser({ ...newUser, senha: e.target.value })} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Perfil *</label>
                                <select 
                                    className="input" 
                                    value={newUser.role} 
                                    onChange={e => setNewUser({ ...newUser, role: parseInt(e.target.value) as UserRole })}
                                >
                                    <option value={UserRole.Paciente}>Paciente</option>
                                    <option value={UserRole.Medico}>Médico</option>
                                    <option value={UserRole.Admin}>Admin</option>
                                </select>
                            </div>
                            {newUser.role !== UserRole.Admin && (
                                <div className="form-group">
                                    <label className="label">Telefone {newUser.role === UserRole.Paciente ? '' : '*'}</label>
                                    <input 
                                        className="input" 
                                        type="tel"
                                        required={newUser.role === UserRole.Medico}
                                        value={newUser.telefone} 
                                        onChange={e => setNewUser({ ...newUser, telefone: e.target.value })} 
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
