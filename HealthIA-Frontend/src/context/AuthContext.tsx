import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../types';
import type { PacienteDTO, ConsultaDTO } from '../types';
import { pacienteService } from '../services/apiService';

interface User {
    email: string;
    role: UserRole;
    roleName: string;
    idElement: number; // ID do Admin, Médico ou Paciente
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, role: UserRole, email: string, idElement: number) => Promise<void>;
    logout: () => void;
    loading: boolean;
    pacienteData: PacienteDTO | null;
    consultas: ConsultaDTO[];
    refreshPacienteData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [pacienteData, setPacienteData] = useState<PacienteDTO | null>(null);
    const [consultas, setConsultas] = useState<ConsultaDTO[]>([]);

    const getRoleName = (role: UserRole): string => {
        switch (role) {
            case UserRole.Admin:
                return 'Admin';
            case UserRole.Medico:
                return 'Medico';
            case UserRole.Paciente:
                return 'Paciente';
            default:
                return 'Paciente';
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleStr = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const idElementStr = localStorage.getItem('idElement');

        if (token && roleStr && email && idElementStr) {
            try {
                jwtDecode(token);
                const role = parseInt(roleStr) as UserRole;
                const idElement = parseInt(idElementStr);
                setUser({ email, role, roleName: getRoleName(role), idElement });
                
                // Se for paciente, carregar dados automaticamente
                if (role === UserRole.Paciente) {
                    pacienteService.obterPorId(idElement).then(paciente => {
                        if (paciente) {
                            setPacienteData(paciente);
                            setConsultas(paciente.consultas || []);
                        }
                    }).catch(error => {
                        console.error('Erro ao carregar dados do paciente:', error);
                    });
                }
            } catch (error) {
                console.error("Invalid token found", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (token: string, role: UserRole, email: string, idElement: number) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role.toString());
        localStorage.setItem('email', email);
        localStorage.setItem('idElement', idElement.toString());
        setUser({ email, role, roleName: getRoleName(role), idElement });
        
        // Se for paciente, carregar dados automaticamente após login
        if (role === UserRole.Paciente) {
            try {
                const paciente = await pacienteService.obterPorId(idElement);
                if (paciente) {
                    setPacienteData(paciente);
                    setConsultas(paciente.consultas || []);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do paciente:', error);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('idElement');
        setUser(null);
        setPacienteData(null);
        setConsultas([]);
    };

    const refreshPacienteData = async () => {
        const idElementStr = localStorage.getItem('idElement');
        const roleStr = localStorage.getItem('role');
        
        if (idElementStr && roleStr && parseInt(roleStr) === UserRole.Paciente) {
            try {
                const paciente = await pacienteService.obterPorId(parseInt(idElementStr));
                if (paciente) {
                    setPacienteData(paciente);
                    setConsultas(paciente.consultas || []);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do paciente:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            logout, 
            loading,
            pacienteData,
            consultas,
            refreshPacienteData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
