import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: 'var(--secondary-color)',
            textAlign: 'center'
        }}>
            <div className="card" style={{ maxWidth: '500px', padding: '48px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warning-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <AlertTriangle size={40} color="var(--warning-text)" />
                </div>

                <h1 style={{ 
                    fontSize: '4rem', 
                    fontWeight: 700, 
                    color: 'var(--primary-color)',
                    margin: '0 0 8px 0'
                }}>
                    404
                </h1>

                <h2 style={{ 
                    fontSize: '1.5rem', 
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0'
                }}>
                    Página não encontrada
                </h2>

                <p style={{ 
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                }}>
                    A página que você está procurando não existe ou foi movida.
                    Verifique o endereço ou volte para a página inicial.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        className="btn btn-outline"
                        onClick={() => navigate(-1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ArrowLeft size={18} />
                        Voltar
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Home size={18} />
                        Ir para Início
                    </button>
                </div>
            </div>

            <p style={{ 
                marginTop: '24px', 
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
            }}>
                HealthIA - Sistema de Diagnóstico com IA
            </p>
        </div>
    );
};

export default NotFound;
