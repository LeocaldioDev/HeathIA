using Google.GenAI;
using Google.GenAI.Types;
using HealthIA.Application.DTOs;
using HealthIA.Application.IGemini;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Ioc;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ConsultaController : Controller
    {
        private readonly Client _genClient;
        public readonly IConsultaService consultaService;
        public readonly IUsuarioService usuarioService;
        public readonly IPacienteRepository pacienteRepository;
        public readonly IGeminiService geminiService;


        public ConsultaController(IConsultaService _consultaService, IUsuarioService _usuarioService, Google.GenAI.Client genClient,IGeminiService gemini)
        {
            consultaService = _consultaService;
            usuarioService = _usuarioService;
            _genClient = genClient;
            geminiService = gemini;

        }

        [HttpPost("Incluir")]
        public async Task<IActionResult> Incluir(ConsultaDTO consultadto)
        {
            if (consultadto.Sintomas == null)
                return BadRequest("insira os sintomas");



            var sintomasOrganizados = await geminiService.GerarDiagnosticoAsync(consultadto.Sintomas);
            if (string.IsNullOrEmpty(sintomasOrganizados))
                return BadRequest("Não foi possível gerar um diagnóstico com base nos sintomas fornecidos.");
            consultadto.DiagnosticoIA = sintomasOrganizados;
            consultadto.DataConsulta = DateTime.UtcNow;
            var usuarioId = User.GetId();
            var usuario = await usuarioService.ObterPorId(usuarioId);
            consultadto.PacienteId = usuario.Paciente.Id;

            var consulta = await consultaService.Incluir(consultadto);
            return Ok(consulta);
        }

        [HttpPut("Alterar")]
        public async Task<IActionResult> Alterar(ConsultaDTO consultadto)
        {
            var consulta = await consultaService.ObterPorIdsempost(consultadto.Id);
            if (consulta == null || consulta.Id <= 0)
                return BadRequest("Insira dados validos para a consulta");
            await consultaService.Alterar(consulta);
            return Ok(consulta);

        }


        [HttpDelete("Excluir")]
        public async Task<IActionResult> Excluir(int id)
        {
            var consulta = await consultaService.ObterPorId(id);
            if (consulta == null || consulta.Id <= 0)
                return BadRequest("Insira um Id Valido");
            await consultaService.Excluir(consulta.Id);
            return Ok("Consulta Excluida com Sucesso");
        }

        [HttpGet("ObterPorId")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var consulta = await consultaService.ObterPorId(id);
            if (consulta.Id <= 0 || consulta ==null)
                return NotFound("Insira um Id Valido");
            
            return Ok(consulta);
        }


        [HttpGet("ObterTodos")]
        public async Task<IActionResult> ObterTodos()
        {
            var consultas = await consultaService.ObterTodosAsync();
            return Ok(consultas);
        }

    }
    }
