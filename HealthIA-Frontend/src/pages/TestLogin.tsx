import React, { useState } from 'react';
import axios from 'axios';

const TestLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState<any>(null);

    const testLogin = async () => {
        try {
            console.log('Testando API diretamente...');
            
            // Teste direto com axios puro
            const res = await axios.post('https://localhost:7093/Api/Usuario/login', {
                Email: email,
                Senha: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                validateStatus: () => true // Aceitar qualquer status
            });

            console.log('=== RESPOSTA COMPLETA ===');
            console.log('Status:', res.status);
            console.log('Headers:', res.headers);
            console.log('Data:', res.data);
            console.log('Data stringificado:', JSON.stringify(res.data, null, 2));
            
            // Verificar cada campo
            Object.keys(res.data).forEach(key => {
                console.log(`Campo "${key}":`, res.data[key], `(tipo: ${typeof res.data[key]})`);
            });

            setResponse(res.data);
        } catch (err: any) {
            console.error('Erro:', err);
            console.error('Message:', err.message);
            console.error('Response:', err.response);
            setResponse({ error: err.message });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Teste de Login - Debug</h2>
            
            <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <button onClick={testLogin} style={{ padding: '10px 20px' }}>
                Testar Login
            </button>

            {response && (
                <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                }}>
                    <strong>Resposta do servidor:</strong>
                    <br />
                    {JSON.stringify(response, null, 2)}
                </div>
            )}
        </div>
    );
};

export default TestLogin;
