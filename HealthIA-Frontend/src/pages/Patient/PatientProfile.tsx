import React, { useEffect, useState } from 'react';
import { pacienteService } from '../../services/apiService';
import type { PacienteDTO } from '../../types';
import { User, Phone, Calendar, Save, Mail, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';

const PatientProfile: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<PacienteDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        sexo: 'Masculino',
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
                setError('ID do paciente não encontrado');
                return;
            }

            // Buscar paciente diretamente pelo idElement
            const pacienteAtual = await pacienteService.obterPorId(user.idElement);
            
            if (pacienteAtual) {
                setProfile(pacienteAtual);
                setFormData({
                    nome: pacienteAtual.nome,
                    dataNascimento: pacienteAtual.dataNascimento.split('T')[0],
                    sexo: pacienteAtual.sexo,
                    telefone: pacienteAtual.telefone || ''
                });
            } else {
                setError('Perfil de paciente não encontrado');
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

        try {
            setSaving(true);
            await pacienteService.alterar({
                ...profile,
                nome: formData.nome,
                dataNascimento: formData.dataNascimento,
                sexo: formData.sexo,
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
                dataNascimento: profile.dataNascimento.split('T')[0],
                sexo: profile.sexo,
                telefone: profile.telefone || ''
            });
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

    if (loading) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                <p>Carregando perfil...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="card">
                <Alert type="error" message={error || "Perfil não encontrado"} onClose={() => setError('')} />
            </div>
        );
    }

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
                            color: 'var(--primary-color)',
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}>
                            {formData.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{formData.nome}</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                                {user?.email}
                            </p>
                            <p style={{ color: 'var(--primary-color)', marginTop: '4px', marginBottom: 0, fontSize: '0.9rem' }}>
                                {formData.sexo}
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

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            <div className="card">
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

            {/* Card de Estatísticas */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h2 className="card-title" style={{ marginBottom: '20px' }}>Estatísticas de Saúde</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--primary-color)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total de Consultas</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {profile.consultas?.length || 0}
                        </div>
                    </div>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f3e5f5', 
                        borderRadius: '12px',
                        borderLeft: '4px solid #9c27b0'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Idade</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9c27b0' }}>
                            {calculateAge(formData.dataNascimento)} anos
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
