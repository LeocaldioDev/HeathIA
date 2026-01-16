import api from './api';
import type {
    UsuarioDTO,
    PacienteDTO,
    MedicoDTO,
    AdminDTO,
    ConsultaDTO,
    ConsultaPostDTO,
    LoginModel,
    UserToken,
    CadastroPacienteModel,
    CadastroMedicoModel,
    CadastroAdminModel,
    UsuarioPostDTO,
    PagedResult,
    PaginationParams,
    PaginationParamsConsulta
} from '../types';

// ============ AUTHENTICATION ============
export const authService = {
    login: async (credentials: LoginModel) => {
        const response = await api.post<UserToken>('/Api/Usuario/login', credentials);
        return response.data;
    },
    
    logout: async () => {
        const response = await api.post('/Api/Usuario/logout');
        return response.data;
    },
    
    registerPaciente: async (dados: CadastroPacienteModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/paciente', dados);
        return response.data;
    },
    
    registerMedico: async (dados: CadastroMedicoModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/medico', dados);
        return response.data;
    },
    
    registerAdmin: async (dados: CadastroAdminModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/admin', dados);
        return response.data;
    }
};

// ============ USUARIO ============
export const usuarioService = {
    obterPorId: async (id: number = 0) => {
        const response = await api.get<UsuarioDTO>(`/Api/Usuario/ObterPorId/${id}`);
        return response.data;
    },
    
    obterTodos: async (params?: PaginationParams) => {
        const response = await api.get<PagedResult<UsuarioDTO>>('/Api/Usuario/ObterTodos', { params });
        return response.data;
    },
    
    alterar: async (usuario: UsuarioPostDTO) => {
        const response = await api.put('/Api/Usuario/Alterar', usuario);
        return response.data;
    },
    
    excluir: async (id: number) => {
        const response = await api.delete(`/Api/Usuario/Excluir/${id}`);
        return response.data;
    }
};

// ============ PACIENTE ============
export const pacienteService = {
    incluir: async (paciente: Partial<PacienteDTO>) => {
        const response = await api.post<PacienteDTO>('/Api/Paciente/Incluir', paciente);
        return response.data;
    },
    
    obterPorId: async (id: number) => {
        const response = await api.get<PacienteDTO>(`/Api/Paciente/ObterPorId/${id}`);
        return response.data;
    },
    
    obterTodos: async (params?: PaginationParams) => {
        const response = await api.get('/Api/Paciente/ObterTodos', { params });
        return response.data as PagedResult<PacienteDTO>;
    },
    
    alterar: async (paciente: PacienteDTO) => {
        const response = await api.put('/Api/Paciente/Alterar', paciente);
        return response.data;
    },
    
    excluir: async (id: number) => {
        const response = await api.delete(`/Api/Paciente/Excluir/${id}`);
        return response.data;
    }
};

// ============ MEDICO ============
export const medicoService = {
    incluir: async (medico: Partial<MedicoDTO>) => {
        const response = await api.post<MedicoDTO>('/Api/Medico/Incluir', medico);
        return response.data;
    },
    
    obterPorId: async (id: number) => {
        const response = await api.get<MedicoDTO>(`/Api/Medico/ObterPorId/${id}`);
        return response.data;
    },
    
    obterTodos: async (params?: PaginationParams) => {
        const response = await api.get('/Api/Medico/ObterTodos', { params });
        return response.data as PagedResult<MedicoDTO>;
    },
    
    alterar: async (medico: MedicoDTO) => {
        const response = await api.put('/Api/Medico/Alterar', medico);
        return response.data;
    },
    
    excluir: async (id: number) => {
        const response = await api.delete(`/Api/Medico/Excluir/${id}`);
        return response.data;
    }
};

// ============ ADMIN ============
export const adminService = {
    incluir: async (admin: Partial<AdminDTO>) => {
        const response = await api.post<AdminDTO>('/Api/Admin/Incluir', admin);
        return response.data;
    },
    
    obterPorId: async (id: number) => {
        const response = await api.get<AdminDTO>(`/Api/Admin/ObterPorId/${id}`);
        return response.data;
    },
    
    obterTodos: async (params?: PaginationParams) => {
        const response = await api.get('/Api/Admin/ObterTodos', { params });
        return response.data as PagedResult<AdminDTO>;
    },
    
    alterar: async (admin: AdminDTO) => {
        const response = await api.put('/Api/Admin/Alterar', admin);
        return response.data;
    },
    
    excluir: async (id: number) => {
        const response = await api.delete(`/Api/Admin/Excluir/${id}`);
        return response.data;
    }
};

// ============ CONSULTA (IA) ============
export const consultaService = {
    incluir: async (consulta: Partial<ConsultaDTO>) => {
        const response = await api.post<ConsultaDTO>('/Api/Consulta/Incluir', consulta);
        return response.data;
    },
    
    obterPorId: async (id: number) => {
        const response = await api.get<ConsultaPostDTO>(`/Api/Consulta/ObterPorId/${id}`);
        return response.data;
    },
    
    obterTodos: async (params?: PaginationParams | PaginationParamsConsulta) => {
        const response = await api.get<PagedResult<ConsultaPostDTO>>('/Api/Consulta/ObterTodos', { params });
        return response.data;
    },
    
    alterar: async (consulta: Partial<ConsultaDTO>) => {
        const response = await api.put('/Api/Consulta/Alterar', consulta);
        return response.data;
    },
    
    excluir: async (id: number) => {
        const response = await api.delete(`/Api/Consulta/Excluir/${id}`);
        return response.data;
    }
};

// ============ CADASTRO ============
export const cadastroService = {
    cadastrarPaciente: async (dados: CadastroPacienteModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/paciente', dados);
        return response.data;
    },
    
    cadastrarMedico: async (dados: CadastroMedicoModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/medico', dados);
        return response.data;
    },
    
    cadastrarAdmin: async (dados: CadastroAdminModel) => {
        const response = await api.post<UserToken>('/Api/Cadastro/admin', dados);
        return response.data;
    }
};

// ============ EXCLUSAO (Centralizado) ============
export const exclusaoService = {
    excluirPaciente: async (id: number) => {
        const response = await api.delete(`/Api/Exclusao/paciente/${id}`);
        return response.data;
    },
    
    excluirMedico: async (id: number) => {
        const response = await api.delete(`/Api/Exclusao/medico/${id}`);
        return response.data;
    },
    
    excluirAdmin: async (id: number) => {
        const response = await api.delete(`/Api/Exclusao/admin/${id}`);
        return response.data;
    }
};
