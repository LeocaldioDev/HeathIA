using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CadastroController : ControllerBase
    {
        private readonly ICadastroService _cadastroService;

        public CadastroController(ICadastroService cadastroService)
        {
            _cadastroService = cadastroService;
        }

       [HttpPost("admin")]
        public async Task<ActionResult<UserToken>> CadastrarAdmin([FromBody] CadastroAdminDTO model)
        {
            var resultado = await _cadastroService.RegistrarAdminAsync(model);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(new UserToken { Token = resultado.Token });
        }

        [HttpPost("paciente")]
        public async Task<ActionResult<UserToken>> CadastrarPaciente([FromBody] CadastroPacienteDTO model)
        {
            var resultado = await _cadastroService.RegistrarPacienteAsync(model);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(new UserToken { Token = resultado.Token });
        }

        [HttpPost("medico")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserToken>> CadastrarMedico([FromBody] CadastroMedicoDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = await _cadastroService.RegistrarMedicoAsync(model);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(new UserToken { Token = resultado.Token });
        }
    }
}
