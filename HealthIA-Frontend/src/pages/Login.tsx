import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';
import { UserRole } from '../types';
import { Activity } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('=== INICIANDO LOGIN ===');
            console.log('Email:', email);
            
            const response = await authService.login({
                Email: email,
                Senha: password
            });

            console.log('=== RESPOSTA DO SERVIDOR ===');
            console.log('Login bem-sucedido:', response);

            await login(response.token, response.role, response.email, response.idElement);

            console.log('=== LOGIN SUCESSO - REDIRECIONANDO ===');

            // Redirect based on Role
            switch (response.role) {
                case UserRole.Admin:
                    navigate('/admin');
                    break;
                case UserRole.Medico:
                    navigate('/doctor');
                    break;
                case UserRole.Paciente:
                    navigate('/patient');
                    break;
                default:
                    navigate('/patient');
            }

        } catch (err: any) {
            console.error('Login failed', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Credenciais inválidas. Verifique seu email e senha.');
                } else if (err.response.status === 400) {
                    setError('Dados inválidos. Verifique email e senha.');
                } else {
                    setError(`Erro no servidor: ${err.response.data?.message || err.response.statusText}`);
                }
            } else if (err.request) {
                setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando em https://localhost:7093');
            } else {
                setError(`Erro: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--secondary-color)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
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
                    <p className="text-muted">Acesso ao Sistema de Saúde</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p className="text-sm text-muted">
                        Ainda não tem conta? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Registrar-se</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
