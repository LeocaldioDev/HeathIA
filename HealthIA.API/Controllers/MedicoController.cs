using HealthIA.API.Extensions;
using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoController : ControllerBase
    {
        private readonly IMedicoService medico;
        public MedicoController(IMedicoService medico)
        {
            this.medico = medico;
        }

        [HttpPost("Incluir")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Incluir(MedicoDTO medicoDTO)
        {
            if (medicoDTO == null)
                return BadRequest("Insira um usuario Valido");

            var medicoo = await medico.Incluir(medicoDTO);
            return Ok(medicoo);
        }

        [HttpPut("Alterar")]
        [Authorize(Roles = "Admin,Medico")]
        public async Task<IActionResult> Alterar(MedicoDTO medicoDTO)
        {
            var medicoexiste = await medico.ObterPorId(medicoDTO.Id);
            if (medicoexiste == null || medicoexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await medico.Alterar(medicoDTO);
            return Ok(medicoDTO);
        }

        [HttpDelete("Excluir/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Excluir(int id)
        {
            var medicoo = await medico.ObterPorId(id);
            if ( medicoo == null|| medicoo.Id <= 0)
                return NotFound("Insira um Id Valido");
            await medico.Excluir(medicoo.Id);
            return Ok("Medico Excluido com Sucesso");
        }

        [HttpGet("ObterPorId/{id:int}")]

        [Authorize(Roles = "Admin,Medico")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var medicoo = await medico.ObterPorId(id);
            if ( medicoo == null|| medicoo.Id <= 0)
                return NotFound("Medico não encontrado");
            return Ok(medicoo);

        }
        [HttpGet("ObterTodos")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ObterTodos([FromQuery] PaginationParams paginationParams)
        {
            var medicos = await medico.ObterTodosAsync(paginationParams.PageNumber,paginationParams.PageSize);
            if (medicos == null || !medicos.Any())
                return NotFound("Nenhum Medico Encontrado");
            Response.AddPaginationHeader(new PaginationHeader
                (
                medicos.CurrentPage,
                medicos.Pagesize,
                medicos.TotalCount,
                medicos.TotalPages


                ));
            return Ok(medicos);
        }

    }
}
