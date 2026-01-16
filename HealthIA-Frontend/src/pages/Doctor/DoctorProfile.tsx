import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { MedicoDTO } from '../../types';
import { medicoService } from '../../services/apiService';
import Alert from '../../components/UI/Alert';
import { User, Save, Mail, Phone, IdCard, Stethoscope, Edit } from 'lucide-react';

const DoctorProfile: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<MedicoDTO | null>(null);
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
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            if (!user?.idElement) {
                setError('ID do médico não encontrado');
                return;
            }

            // Buscar médico diretamente pelo idElement
            const medicoAtual = await medicoService.obterPorId(user.idElement);
            
            if (medicoAtual) {
                setProfile(medicoAtual);
                setFormData({
                    nome: medicoAtual.nome,
                    crm: medicoAtual.crm || '',
                    especialidade: medicoAtual.especialidade || '',
                    telefone: medicoAtual.telefone || ''
                });
            } else {
                setError('Perfil de médico não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            setError('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await medicoService.alterar({
                ...profile,
                nome: formData.nome,
                crm: formData.crm,
                especialidade: formData.especialidade,
                telefone: formData.telefone
            });

            setSuccess('Perfil atualizado com sucesso!');
            setEditMode(false);
            loadProfile();
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
        if (profile) {
            setFormData({
                nome: profile.nome,
                crm: profile.crm || '',
                especialidade: profile.especialidade || '',
                telefone: profile.telefone || ''
            });
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    Carregando perfil...
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="card">
                <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div>
            {/* Header com Avatar */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--secondary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary-color)'
                        }}>
                            <Stethoscope size={40} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Dr(a). {formData.nome}</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                                {user?.email}
                            </p>
                            <p style={{ color: 'var(--primary-color)', marginTop: '4px', marginBottom: 0, fontSize: '0.9rem' }}>
                                {formData.especialidade || 'Especialidade não informada'} {formData.crm ? `• CRM: ${formData.crm}` : ''}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {editMode ? (
                            <>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Save size={18} /> {saving ? 'Salvando...' : 'Salvar'}
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

            {/* Alerts */}
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Formulário de Edição */}
            <div className="card">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <User size={20} />
                    Dados Profissionais
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Nome */}
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
                            className="input"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Digite seu nome completo"
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>



                    {/* CRM */}
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
                            className="input"
                            value={formData.crm}
                            onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                            placeholder="Digite seu CRM"
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>

                    {/* Especialidade */}
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
                            className="input"
                            value={formData.especialidade}
                            onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                            placeholder="Digite sua especialidade"
                            disabled={!editMode}
                            style={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                ...((!editMode) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {})
                            }}
                        />
                    </div>

                    {/* Telefone */}
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
                            type="tel"
                            className="input"
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
        </div>
    );
};

export default DoctorProfile;
