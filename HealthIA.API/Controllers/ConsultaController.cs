using Google.GenAI;
using Google.GenAI.Types;
using HealthIA.API.Extensions;
using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.IGemini;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Ioc;
using Microsoft.AspNetCore.Authorization;
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
            this.consultaService = _consultaService;
            this.usuarioService = _usuarioService;
            this._genClient = genClient;
            this.geminiService = gemini;

        }

        [HttpPost("Incluir")]
        [Authorize(Roles = "Paciente")]
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
            consultadto.PacienteId =(int) usuario.Pacienteid;

            var consulta = await consultaService.Incluir(consultadto);
            return Ok(consulta);
        }

        [HttpPut("Alterar")]
        [Authorize(Roles = "Medico,Admin")]
        public async Task<IActionResult> Alterar(ConsultaDTO consultadto)
        {
            var consulta = await consultaService.ObterPorIdsempost(consultadto.Id);
            if (consulta == null || consulta.Id <= 0)
                return BadRequest("Insira dados validos para a consulta");
            await consultaService.Alterar(consulta);
            return Ok(consulta);

        }


        [HttpDelete("Excluir/{id:int}")]
        [Authorize]
        public async Task<IActionResult> Excluir(int id)
        {
            var consulta = await consultaService.ObterPorId(id);
            if (consulta == null || consulta.Id <= 0)
                return BadRequest("Insira um Id Valido");
            await consultaService.Excluir(consulta.Id);
            return Ok("Consulta Excluida com Sucesso");
        }

        [HttpGet("ObterPorId/{id:int}")]
        [Authorize(Roles = "Medico,Admin")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var consulta = await consultaService.ObterPorId(id);
            if (consulta ==null|| consulta.Id <= 0)
                return NotFound("Nenhuma consulta encontrada");
            
            return Ok(consulta);
        }


        [HttpGet("ObterTodos")]
        [Authorize(Roles = "Medico,Admin")]
        public async Task<IActionResult> ObterTodos([FromQuery] PaginationParamsConsulta paginationParams)
        {
            var consultas = await consultaService.ObterTodosAsync(paginationParams.PacienteId,paginationParams.PageNumber,paginationParams.PageSize);
            if (consultas == null || !consultas.Any())
                return NotFound("Nenhuma consulta encontrada");

            Response.AddPaginationHeader(new PaginationHeader
                (
                consultas.CurrentPage,
                consultas.Pagesize,
                consultas.TotalCount,
                consultas.TotalPages


                )); 
            return Ok(consultas);
        }


    }
    }
