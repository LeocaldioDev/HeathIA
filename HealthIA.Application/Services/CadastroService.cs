using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Account;
using HealthIA.Domain.Entities;

namespace HealthIA.Application.Services
{
    public class CadastroService : ICadastroService
    {
        private readonly IUsuarioService _usuarioService;
        private readonly IPacienteService _pacienteService;
        private readonly IAdminService _adminService;
        private readonly IMedicoService _medicoService;
        private readonly IAuthenticate _authService;
        private readonly IMapper _mapper;

        public CadastroService(
            IUsuarioService usuarioService,
            IPacienteService pacienteService,
            IAdminService adminService,
            IMedicoService medicoService,
            IAuthenticate authService,
            IMapper mapper)
        {
            _usuarioService = usuarioService;
            _pacienteService = pacienteService;
            _adminService = adminService;
            _medicoService = medicoService;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<RegistroResult> RegistrarPacienteAsync(CadastroPacienteDTO model)
        {
            if (await _authService.UserExists(model.Email))
                return new RegistroResult { Sucesso = false, Mensagem = "Este email já possui cadastro." };

            try
            {
                var usuarioDto = new UsuarioregisterDTO
                {
                    Email = model.Email,
                    Role = UserRole.Paciente,
                    password = model.Password
                };

                var usuario = await _usuarioService.Incluir(usuarioDto);
                if (usuario == null)
                    return new RegistroResult { Sucesso = false, Mensagem = "Erro ao cadastrar usuário." };

                var pacienteDto = new PacienteDTO
                {
                    Nome = model.Nome,
                    DataNascimento = model.DataNascimento,
                    Sexo = model.Sexo,
                    Telefone = model.Telefone,
                    UsuarioId = usuario.Id
                };

                await _pacienteService.Incluir(pacienteDto);

                var token = _authService.GenerateToken(usuario.Id, usuario.Email, usuario.Role);
                return new RegistroResult { Sucesso = true, Token = token };
            }
            catch (Exception ex)
            {
                return new RegistroResult { Sucesso = false, Mensagem = "Erro ao processar cadastro." };
            }
        }

        public async Task<RegistroResult> RegistrarAdminAsync(CadastroAdminDTO model)
        {
            if (await _authService.UserExists(model.Email))
                return new RegistroResult { Sucesso = false, Mensagem = "Este email já possui um cadastro." };

            try
            {
                var usuarioDto = new UsuarioregisterDTO
                {
                    Email = model.Email,
                    Role = UserRole.Admin,
                    password = model.Password
                };

                var usuario = await _usuarioService.Incluir(usuarioDto);
                if (usuario == null)
                    return new RegistroResult { Sucesso = false, Mensagem = "Erro ao cadastrar usuário." };

                var adminDto = new AdminDTO
                {
                    Nome = model.Nome,
                    UsuarioId = usuario.Id
                };

                var admin = await _adminService.Incluir(adminDto);
                if (admin == null)
                    return new RegistroResult { Sucesso = false, Mensagem = "Erro ao cadastrar administrador." };

                var token = _authService.GenerateToken(usuario.Id, usuario.Email, usuario.Role);
                return new RegistroResult { Sucesso = true, Token = token };
            }
            catch (Exception ex)
            {
                return new RegistroResult { Sucesso = false, Mensagem = "Erro ao processar cadastro." };
            }
        }

        public async Task<RegistroResult> RegistrarMedicoAsync(CadastroMedicoDTO model)
        {
            if (await _authService.UserExists(model.Email))
                return new RegistroResult { Sucesso = false, Mensagem = "Este email já possui um cadastro." };

            try
            {
                var usuarioDto = new UsuarioregisterDTO
                {
                    Email = model.Email,
                    Role = UserRole.Medico,
                    password = model.Password
                };

                var usuario = await _usuarioService.Incluir(usuarioDto);
                if (usuario == null)
                    return new RegistroResult { Sucesso = false, Mensagem = "Erro ao cadastrar usuário." };

                var medicoDto = new MedicoDTO
                {
                    Nome = model.Nome,
                    UsuarioId = usuario.Id
                };

                var medico = await _medicoService.Incluir(medicoDto);
                if (medico == null)
                    return new RegistroResult { Sucesso = false, Mensagem = "Erro ao cadastrar médico." };

                var token = _authService.GenerateToken(usuario.Id, usuario.Email, usuario.Role);
                return new RegistroResult { Sucesso = true, Token = token };
            }
            catch (Exception ex)
            {
                return new RegistroResult { Sucesso = false, Mensagem = "Erro ao processar cadastro." };
            }
        }
    }
}
