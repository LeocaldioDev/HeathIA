import React, { useState, useEffect } from 'react';
import { Activity, Send, MapPin } from 'lucide-react';
import { consultaService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';

const PatientHome: React.FC = () => {
    const { refreshPacienteData } = useAuth();
    const [sintomas, setSintomas] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<{
        diagnosticoIA: string;
        id: number;
    } | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        // Obter localização do usuário
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Erro ao obter localização:', error);
                    // Localização padrão (Brasília, DF)
                    setUserLocation({ lat: -15.7801, lng: -47.9292 });
                }
            );
        } else {
            // Localização padrão se geolocalização não estiver disponível
            setUserLocation({ lat: -15.7801, lng: -47.9292 });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setResultado(null);
        
        if (!sintomas.trim()) {
            setError('Por favor, descreva seus sintomas');
            return;
        }

        setLoading(true);

        try {
            const consulta = await consultaService.incluir({
                sintomas: sintomas.trim()
            });

            setResultado({
                diagnosticoIA: consulta.diagnosticoIA || 'Processando...',
                id: consulta.id
            });
            setSuccess('Análise concluída! A consulta foi registrada e está aguardando validação médica.');
            setSintomas('');
            
            // Atualizar dados do paciente no contexto para manter consultas sincronizadas
            await refreshPacienteData();
        } catch (err: any) {
            console.error('Erro ao criar consulta:', err);
            setError(err.response?.data?.message || 'Erro ao processar sua consulta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Activity size={28} color="var(--primary-color)" />
                    <h1 className="card-title" style={{ margin: 0 }}>Nova Consulta IA</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Descreva seus sintomas e receba uma análise preliminar por IA. 
                    Um médico irá validar o diagnóstico posteriormente.
                </p>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="sintomas">
                            Descreva seus sintomas
                        </label>
                        <textarea
                            id="sintomas"
                            className="input"
                            value={sintomas}
                            onChange={(e) => setSintomas(e.target.value)}
                            placeholder="Exemplo: Dor de cabeça intensa, febre alta, dores no corpo..."
                            rows={6}
                            style={{ resize: 'vertical', minHeight: '120px' }}
                            disabled={loading}
                        />
                        <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                            Seja o mais detalhado possível sobre seus sintomas, duração e intensidade.
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !sintomas.trim()}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? (
                            <>Analisando seus sintomas...</>
                        ) : (
                            <>
                                <Send size={18} />
                                Solicitar Análise IA
                            </>
                        )}
                    </button>
                </form>
            </div>

            {resultado && (
                <div className="card" style={{ marginTop: '20px', backgroundColor: 'var(--secondary-color)' }}>
                    <h2 className="card-title">Resultado da Análise IA</h2>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '16px',
                        borderRadius: '6px',
                        borderLeft: '4px solid var(--primary-color)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                    }}>
                        {resultado.diagnosticoIA}
                    </div>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'var(--warning-bg)',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        color: 'var(--warning-text)'
                    }}>
                        <strong>Atenção:</strong> Este é um diagnóstico preliminar gerado por IA. 
                        Aguarde a validação de um médico antes de tomar qualquer decisão.
                        Consulta #{resultado.id} registrada.
                    </div>
                </div>
            )}

            {/* Mapa de Hospitais Próximos */}
            <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <MapPin size={28} color="var(--primary-color)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Hospitais Próximos</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Encontre hospitais e clínicas na sua região
                </p>
                {userLocation ? (
                    <>
                        <div style={{ 
                            width: '100%', 
                            height: '450px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0',
                            marginBottom: '16px'
                        }}>
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=hospital+near+me&t=&z=15&ie=UTF8&iwloc=&output=embed&ll=${userLocation.lat},${userLocation.lng}`}
                                allowFullScreen
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a
                                href={`https://www.google.com/maps/search/hospital/@${userLocation.lat},${userLocation.lng},16z`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <MapPin size={18} />
                                Ver Hospitais no Google Maps
                            </a>
                            <a
                                href={`https://www.google.com/maps/search/pronto+socorro/@${userLocation.lat},${userLocation.lng},16z`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Activity size={18} />
                                Pronto Socorro
                            </a>
                        </div>
                    </>
                ) : (
                    <div style={{ 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        gap: '16px'
                    }}>
                        <div className="spinner"></div>
                        <p>Carregando sua localização...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHome;
