using HealthIA.Application.Interfaces;
using HealthIA.Domain.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class ExclusaoController : ControllerBase
    {
        private readonly IPacienteService _pacienteService;
        private readonly IAdminService _adminService;
        private readonly IMedicoService _medicoService;
        private readonly IUsuarioService _usuarioService;

        public ExclusaoController(
            IPacienteService pacienteService,
            IAdminService adminService,
            IMedicoService medicoService,
            IUsuarioService usuarioService)
        {
            _pacienteService = pacienteService;
            _adminService = adminService;
            _medicoService = medicoService;
            _usuarioService = usuarioService;
        }

        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExcluirAdmin(int id)
        {
            var admin = await _adminService.ObterPorId(id);
            if (admin == null) return NotFound("Administrador não encontrado.");

            await _adminService.Excluir(id);
            await _usuarioService.Excluir(admin.UsuarioId);

            return NoContent();
        }

        [HttpDelete("paciente/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExcluirPaciente(int id)
        {
            var paciente = await _pacienteService.ObterPorId(id);
            if (paciente == null) return NotFound("Paciente não encontrado.");

            await _pacienteService.Excluir(id);
            await _usuarioService.Excluir(paciente.UsuarioId);

            return NoContent();
        }

        [HttpDelete("medico/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExcluirMedico(int id)
        {
            var medico = await _medicoService.ObterPorId(id);
            if (medico == null) return NotFound("Médico não encontrado.");

            await _medicoService.Excluir(id);
            await _usuarioService.Excluir(medico.UsuarioId);

            return NoContent();
        }
    }
}