using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Account;
using HealthIA.Domain.Entities;
using HealthIA.Infra.Ioc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route ("Api/[Controller]")]
    public class CadastroController : ControllerBase
    {

        private readonly IPacienteService _pacienteService;
        private readonly IAdminService _adminService;
        private readonly IMedicoService _medicoService;
        private readonly IUsuarioService _usuarioService;
        private readonly IAuthenticate _Authenticateservice;

        public CadastroController(
            IPacienteService pacienteService,
            IAdminService adminService,
            IMedicoService medicoService,
            IUsuarioService usuarioService,
            IAuthenticate authenticateService)
        {
            this._pacienteService = pacienteService;
            this._adminService = adminService;
            this._medicoService = medicoService;
            this._usuarioService = usuarioService;
            this._Authenticateservice = authenticateService;
        }


        [HttpPost("admin")]
       [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserToken>> CadastrarAdmin(
     [FromBody] CadastroAdminModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExiste = await _Authenticateservice.UserExists(model.Email);
            if (emailExiste)
                return BadRequest("Este email já possui um cadastro.");

            // USUÁRIO
            var usuarioDto = new UsuarioregisterDTO
            {
                Email = model.Email,
                Role = UserRole.Admin,
                password = model.Password
                
            };

            var usuario = await _usuarioService.Incluir(usuarioDto);
            if (usuario == null)
                return BadRequest("Erro ao cadastrar usuário.");

            // ADMIN
            var adminDto = new AdminDTO
            {
                Nome = model.Nome,
                UsuarioId = usuario.Id
            };

            var admin = await _adminService.Incluir(adminDto);
            if (admin == null)
                return BadRequest("Erro ao cadastrar administrador.");

            var token = _Authenticateservice.GenerateToken(
                usuario.Id, usuario.Email, usuario.Role);

            return Ok(new UserToken
            {
                Token = token
            });
        }





        [HttpPost("paciente")]
        public async Task<ActionResult<UserToken>> CadastrarPaciente(
            [FromBody] cadastroPacienteModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExiste = await _Authenticateservice.UserExists(user.Email);
            if (emailExiste)
                return BadRequest("Este email já possui cadastro.");

            var usuarioS = new UsuarioregisterDTO
            {
                Email = user.Email,
                Role = UserRole.Paciente,
                password = user.Password
                
            };

            var usuario = await _usuarioService.Incluir(usuarioS);
            if (usuario == null)
                return BadRequest("Erro ao cadastrar usuário.");

            var pacienteS = new PacienteDTO
            {
                Nome = user.Nome,
                DataNascimento = user.DataNascimento,
                Sexo = user.Sexo,
                Telefone = user.Telefone,
                UsuarioId = usuario.Id
            };

            await _pacienteService.Incluir(pacienteS);

            var token = _Authenticateservice.GenerateToken(
                usuario.Id, usuario.Email, usuario.Role);

            return Ok(new UserToken { Token = token });
        }



        [HttpPost("medico")]
        public async Task<ActionResult<UserToken>> CadastrarMedico(
      [FromBody] CadastroMedicoModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExiste = await _Authenticateservice.UserExists(model.Email);
            if (emailExiste)
                return BadRequest("Este email já possui um cadastro.");

            // USUÁRIO
            var usuarioDto = new UsuarioregisterDTO
            {
                Email = model.Email,
                Role = UserRole.Medico,
                password = model.Password
            };

            var usuario = await _usuarioService.Incluir(usuarioDto);
            if (usuario == null)
                return BadRequest("Erro ao cadastrar usuário.");

            // MÉDICO
            var medicoDto = new MedicoDTO
            {
                Nome = model.Nome,
                UsuarioId = usuario.Id
            };

            var medico = await _medicoService.Incluir(medicoDto);
            if (medico == null)
                return BadRequest("Erro ao cadastrar médico.");

            var token = _Authenticateservice.GenerateToken(
                usuario.Id, usuario.Email, usuario.Role);

            return Ok(new UserToken
            {
                Token = token
            });
        }



    }
}
