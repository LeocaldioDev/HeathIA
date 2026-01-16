import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MedicoDTO } from '../../types';
import { medicoService, exclusaoService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import { ArrowLeft, Save, Trash, Stethoscope, User, Phone, Edit, X } from 'lucide-react';

const MedicoProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [medico, setMedico] = useState<MedicoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: ''
    });

    useEffect(() => {
        if (id) {
            loadMedico(parseInt(id));
        }
    }, [id]);

    const loadMedico = async (medicoId: number) => {
        try {
            setLoading(true);
            const data = await medicoService.obterPorId(medicoId);
            setMedico(data);
            setFormData({
                nome: data.nome,
                crm: data.crm || '',
                especialidade: data.especialidade || '',
                telefone: data.telefone || ''
            });
        } catch (err: any) {
            console.error('Erro ao carregar médico:', err);
            setError('Erro ao carregar dados do médico');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!medico) return;

        try {
            setSaving(true);
            await medicoService.alterar({
                ...medico,
                nome: formData.nome,
                crm: formData.crm,
                especialidade: formData.especialidade,
                telefone: formData.telefone
            });
            setSuccess('Médico atualizado com sucesso!');
            setEditMode(false);
            loadMedico(medico.id);
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
        if (medico) {
            setFormData({
                nome: medico.nome,
                crm: medico.crm || '',
                especialidade: medico.especialidade || '',
                telefone: medico.telefone || ''
            });
        }
    };

    const handleDelete = async () => {
        if (!medico) return;
        if (!window.confirm(`Tem certeza que deseja excluir o médico ${medico.nome}?`)) return;

        try {
            await exclusaoService.excluirMedico(medico.id);
            setSuccess('Médico excluído com sucesso!');
            setTimeout(() => navigate('/admin/medicos'), 1500);
        } catch (err: any) {
            console.error('Erro ao excluir:', err);
            setError('Erro ao excluir médico');
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            </div>
        );
    }

    if (!medico) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Médico não encontrado
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
                    onClick={() => navigate('/admin/medicos')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Voltar
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Trash size={18} /> Excluir Médico
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
                        {medico.nome.charAt(0).toUpperCase()}
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
                            {medico.nome}
                        </h1>
                        <p style={{ 
                            margin: 0, 
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem'
                        }}>
                            {medico.email} • {medico.especialidade || 'Especialidade não informada'} • CRM: {medico.crm || 'N/A'}
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

            {/* Card de Dados Profissionais */}
            <div className="card">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Stethoscope size={24} />
                    Dados Profissionais
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
                            placeholder="Dr. João Silva"
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
                            CRM
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.crm}
                            onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                            placeholder="CRM 12345/SP"
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
                            Especialidade
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.especialidade}
                            onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                            placeholder="Cardiologia, Clínico Geral, etc."
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

            {/* Estatísticas */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h2 className="card-title">Estatísticas</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {medico.consultas?.length || 0}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Consultas Realizadas
                        </div>
                    </div>
                    
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-text)' }}>
                            {medico.consultas?.filter(c => c.validacaomedica).length || 0}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Consultas Validadas
                        </div>
                    </div>

                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>
                            {medico.consultas?.filter(c => !c.validacaomedica).length || 0}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Pendentes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicoProfile;
