import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { AdminDTO } from '../../types';
import { adminService, exclusaoService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';
import { ArrowLeft, Save, Trash, Shield, User, Edit, X } from 'lucide-react';

const AdminProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [admin, setAdmin] = useState<AdminDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        cargo: ''
    });

    useEffect(() => {
        // Se não houver ID na URL, carregar o perfil do admin logado
        const adminId = id ? parseInt(id) : user?.idElement;
        
        if (adminId) {
            loadAdmin(adminId);
        } else {
            setError('ID do administrador não encontrado');
            setLoading(false);
        }
    }, [id, user]);

    const loadAdmin = async (adminId: number) => {
        try {
            setLoading(true);
            const data = await adminService.obterPorId(adminId);
            setAdmin(data);
            setFormData({
                nome: data.nome,
                cargo: data.cargo || ''
            });
        } catch (err: any) {
            console.error('Erro ao carregar admin:', err);
            setError('Erro ao carregar dados do administrador');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!admin) return;

        try {
            setSaving(true);
            await adminService.alterar({
                ...admin,
                nome: formData.nome,
                cargo: formData.cargo
            });
            setSuccess('Administrador atualizado com sucesso!');
            setEditMode(false);
            loadAdmin(admin.id);
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
        if (admin) {
            setFormData({
                nome: admin.nome,
                cargo: admin.cargo || ''
            });
        }
    };

    const handleDelete = async () => {
        if (!admin) return;
        if (!window.confirm(`Tem certeza que deseja excluir o administrador ${admin.nome}?`)) return;

        try {
            await exclusaoService.excluirAdmin(admin.id);
            setSuccess('Administrador excluído com sucesso!');
            setTimeout(() => navigate('/admin/admins'), 1500);
        } catch (err: any) {
            console.error('Erro ao excluir:', err);
            setError('Erro ao excluir administrador');
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Administrador não encontrado
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
                    onClick={() => navigate('/admin/admins')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Voltar
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Trash size={18} /> Excluir Admin
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
                        {admin.nome.charAt(0).toUpperCase()}
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
                            {admin.nome}
                        </h1>
                        <p style={{ 
                            margin: 0, 
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem'
                        }}>
                            {admin.email} • {admin.cargo || 'Cargo não informado'}
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

            {/* Card de Dados */}
            <div className="card">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Shield size={24} />
                    Dados do Administrador
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
                            Cargo
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.cargo}
                            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                            placeholder="Administrador Geral, Supervisor, etc."
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

            {/* Informações Adicionais */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h2 className="card-title">Permissões e Acesso</h2>
                <div style={{ marginTop: '16px' }}>
                    <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: '8px',
                        borderLeft: '4px solid var(--primary-color)'
                    }}>
                        <strong style={{ color: 'var(--primary-color)' }}>Nível de Acesso: Administrador</strong>
                        <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Este usuário possui permissões completas no sistema, incluindo:
                        </p>
                        <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>Gerenciar pacientes, médicos e outros administradores</li>
                            <li>Visualizar e gerenciar todas as consultas</li>
                            <li>Gerenciar usuários do sistema</li>
                            <li>Acesso completo a todas as funcionalidades</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
