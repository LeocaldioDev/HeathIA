using HealthIA.API.Extensions;
using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacienteController : ControllerBase
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
        [Authorize]
        public async Task<IActionResult> Alterar(PacienteDTO pacienteDTO)
        {
            var pacienteexiste= await pacienteService.ObterPorId(pacienteDTO.Id);
            if (pacienteexiste == null || pacienteexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await pacienteService.Alterar(pacienteDTO);
            return Ok(pacienteDTO);
        }

        [HttpDelete("Excluir/{id:int}")]
       // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Excluir(int id)
        {
           var  paciente = await pacienteService.ObterPorId(id);
            if ( paciente == null|| paciente.Id <= 0)
                return NotFound("Insira um Id Valido");
            await pacienteService.Excluir(paciente.Id);
            return Ok("Paciente Excluido com Sucesso");
        }

        [HttpGet("ObterPorId/{id:int}")]
        [Authorize]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var paciente = await pacienteService.ObterPorIdPost(id);
            if ( paciente == null|| paciente.Id <= 0)
                return NotFound("Paciente não encontrado");
            return Ok(paciente);

        }

        [HttpGet("ObterTodos")]
       //[Authorize(Roles = "Medico,Admin")]
        public async Task<IActionResult> ObterTodos([FromQuery] PaginationParams paginationParams)
        {
            var pacientes = await pacienteService.ObterTodosAsync(paginationParams.PageNumber,paginationParams.PageSize);
            if (pacientes == null ||!pacientes.Any())
                return NotFound("Nenhum paciente encontrado");

            Response.AddPaginationHeader(new PaginationHeader
                (
                pacientes.CurrentPage,
                pacientes.Pagesize,
                pacientes.TotalCount,
                pacientes.TotalPages


                ));
            return Ok(pacientes);
        }

    }
    }
