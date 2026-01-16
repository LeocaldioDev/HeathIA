import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { cadastroService } from '../services/apiService';
import { Sexo } from '../types';
import Alert from '../components/UI/Alert';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        dataNascimento: '',
        sexo: Sexo.Masculino,
        telefone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não conferem');
            return;
        }

        setLoading(true);

        try {
            await cadastroService.cadastrarPaciente({
                Nome: formData.nome,
                Email: formData.email,
                Password: formData.password,
                DataNascimento: formData.dataNascimento,
                Sexo: formData.sexo === 0 ? "Masculino" : formData.sexo === 1 ? "Feminino" : "Outro",
                Telefone: formData.telefone
            });

            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (err: any) {
            console.error('Erro ao registrar:', err);
            setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--secondary-color)',
            padding: '20px'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--secondary-color)',
                        color: 'var(--primary-color)',
                        marginBottom: '16px'
                    }}>
                        <Activity size={40} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>HealthIA</h1>
                    <p className="text-muted">Cadastro de Paciente</p>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="nome">Nome Completo</label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            className="input"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="telefone">Telefone</label>
                        <input
                            id="telefone"
                            name="telefone"
                            type="tel"
                            className="input"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="dataNascimento">Data de Nascimento</label>
                        <input
                            id="dataNascimento"
                            name="dataNascimento"
                            type="date"
                            className="input"
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="sexo">Sexo</label>
                        <select
                            id="sexo"
                            name="sexo"
                            className="input"
                            value={formData.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value={Sexo.Masculino}>Masculino</option>
                            <option value={Sexo.Feminino}>Feminino</option>
                            <option value={Sexo.Outro}>Outro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="confirmPassword">Confirmar Senha</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p className="text-sm text-muted">
                        Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Fazer login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
