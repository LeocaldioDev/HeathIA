// ============ ENUMS ============
export enum UserRole {
    Admin = 1,
    Medico = 2,
    Paciente = 3
}

export enum ConsultaStatus {
    NaoVerificado = 0,
    Aprovado = 1,
    Reprovado = 2
}

export enum Sexo {
    Masculino = 0,
    Feminino = 1,
    Outro = 2
}

// ============ DTOs ============
export interface UsuarioDTO {
    id: number;
    email: string;
    role: UserRole;
    password?: string;
    paciente?: PacienteDTO;
    medico?: MedicoDTO;
    admin?: AdminDTO;
}

export interface PacienteDTO {
    id: number;
    nome: string;
    dataNascimento: string;
    sexo: string; // "Masculino", "Feminino", "Outro" - é string no backend
    telefone: string;
    usuarioId: number;
    consultas?: ConsultaDTO[];
}

export interface MedicoDTO {
    id: number;
    nome: string;
    usuarioId: number;
    crm?: string;
    especialidade?: string;
    telefone?: string;
    consultas?: ConsultaDTO[];
}

export interface AdminDTO {
    id: number;
    nome: string;
    usuarioId: number;
    cargo?: string;
}

export interface ConsultaDTO {
    id: number;
    sintomas: string;
    diagnosticoIA?: string;
    validacaomedica: boolean; // boolean no backend, não enum
    dataConsulta: string;
    pacienteId: number;
    paciente?: PacienteDTO;
    medicoId?: number;
    medico?: MedicoDTO;
    descricao?: string;
    respostaIA?: string;
    observacoesMedico?: string;
}

export interface ConsultaPostDTO {
    id: number;
    sintomas: string;
    diagnosticoIA?: string;
    validacaomedica: boolean;
    dataConsulta: string;
    pacienteId: number;
    pacienteNome?: string;
}

// ============ REQUEST MODELS ============
export interface LoginModel {
    Email: string;
    Senha: string;
}

export interface CadastroPacienteModel {
    Nome: string;
    Email: string;
    Password: string;
    DataNascimento: string;
    Sexo: string; // string no backend
    Telefone: string;
}

export interface CadastroMedicoModel {
    Nome: string;
    Email: string;
    Password: string;
}

export interface CadastroAdminModel {
    Nome: string;
    Email: string;
    Password: string;
}

export interface UsuarioPostDTO {
    id: number;
    email: string;
    role: UserRole;
}

// ============ RESPONSE MODELS ============
export interface UserToken {
    token: string;
    role: UserRole;
    email: string;
    idElement: number; // ID do Admin, Médico ou Paciente baseado na role
}

export interface PaginationHeader {
    TotalCount: number;
    PageSize: number;
    CurrentPage: number;
    TotalPages: number;
    HasNext: boolean;
    HasPrevious: boolean;
}

export interface PagedResult<T> {
    items: T[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginationParams {
    PageNumber?: number;
    PageSize?: number;
}

export interface PaginationParamsConsulta {
    PacienteId: number;
    PageNumber?: number;
    PageSize?: number;
}

// ============ LEGACY/DEMO TYPES ============
export interface MedicalResultDTO {
    id: string;
    pacienteNome: string;
    dataExame: string;
    conteudoIA: string;
    status: string;
    observacaoMedico?: string;
}
