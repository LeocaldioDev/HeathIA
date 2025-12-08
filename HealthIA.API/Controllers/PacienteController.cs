using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class PacienteController : Controller
    {
        private readonly IPacienteService pacienteService;

        public PacienteController(IPacienteService Pacienteservice)
        {
            this.pacienteService = Pacienteservice;
        }

        [HttpPost("Incluir")]
        public async Task<IActionResult> Incluir(PacienteDTO pacienteDTO)
        {
            if (pacienteDTO == null)
                return BadRequest("Insira um usuario Valido");

            var paciente = await pacienteService.Incluir(pacienteDTO);
            return Ok(paciente);
        }

        [HttpPut("Alterar")]
        public async Task<IActionResult> Alterar(PacienteDTO pacienteDTO)
        {
            var pacienteexiste= await pacienteService.ObterPorId(pacienteDTO.Id);
            if (pacienteexiste == null || pacienteexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await pacienteService.Alterar(pacienteexiste);
            return Ok(pacienteexiste);
        }

        [HttpDelete("Excluir")]
        public async Task<IActionResult> Excluir(int id)
        {
           var  paciente = await pacienteService.ObterPorId(id);
            if (paciente.Id <= 0 || paciente == null)
                return NotFound("Insira um Id Valido");
            await pacienteService.Excluir(paciente.Id);
            return Ok("Paciente Excluido com Sucesso");
        }

        [HttpGet("ObterPorId")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var paciente = await pacienteService.ObterPorIdPost(id);
            if (paciente.Id <= 0 || paciente == null)
                return NotFound("Insira um Id Valido");
            return Ok(paciente);

        }
        [HttpGet("ObterTodos")]
        public async Task<IActionResult> ObterTodos()
        {
            var pacientes = await pacienteService.ObterTodosAsync();
            return Ok(pacientes);
        }

    }
    }
