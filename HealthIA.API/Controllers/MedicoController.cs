using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Entities;
using Microsoft.AspNetCore.Mvc;


namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoController : Controller
    {
        private readonly IMedicoService medico;
        public MedicoController(IMedicoService medico)
        {
            medico = medico;
        }
        [HttpPost("Incluir")]
        public async Task<IActionResult> Incluir(MedicoDTO medicoDTO)
        {
            if (medicoDTO == null)
                return BadRequest("Insira um usuario Valido");

            var medicoo = await medico.Incluir(medicoDTO);
            return Ok(medicoo);
        }

        [HttpPut("Alterar")]
        public async Task<IActionResult> Alterar(MedicoDTO medicoDTO)
        {
            var medicoexiste = await medico.ObterPorId(medicoDTO.Id);
            if (medicoexiste == null || medicoexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await medico.Alterar(medicoexiste);
            return Ok(medicoexiste);
        }

        [HttpDelete("Excluir")]
        public async Task<IActionResult> Excluir(int id)
        {
            var medicoo = await medico.ObterPorId(id);
            if (medicoo.Id <= 0 || medicoo == null)
                return NotFound("Insira um Id Valido");
            await medico.Excluir(medicoo.Id);
            return Ok("Medico Excluido com Sucesso");
        }

        [HttpGet("ObterPorId")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var medicoo = await medico.ObterPorId(id);
            if (medicoo.Id <= 0 || medicoo == null)
                return NotFound("Insira um Id Valido");
            return Ok(medicoo);

        }
        [HttpGet("ObterTodos")]
        public async Task<IActionResult> ObterTodos()
        {
            var medicos = await medico.ObterTodosAsync();
            return Ok(medicos);
        }

    }
}
