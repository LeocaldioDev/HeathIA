using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ConsultaController : Controller
    {
        public readonly IConsultaService consultaService;
        public ConsultaController(IConsultaService consultaService)
        {
            this.consultaService = consultaService;
        }

        [HttpPost("Incluir")]
        public async Task<IActionResult> Incluir(ConsultaDTO consultadto)
        {
            if (consultadto == null)
                return BadRequest("Insira dados validos para a consulta");
            var consulta = await consultaService.Incluir(consultadto);
            return Ok(consulta);
        }

        [HttpPut("Alterar")]
        public async Task<IActionResult> Alterar(ConsultaDTO consultadto)
        {
            var consulta = await consultaService.ObterPorId(consultadto.Id);
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
