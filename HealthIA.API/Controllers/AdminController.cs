using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly IAdminService admin;
        public AdminController(IAdminService adminService)
        {
            this.admin = adminService;
        }

        [HttpPost("Incluir")]
        public async Task<IActionResult> Incluir(AdminDTO adminDTO)
        {
            if (adminDTO == null)
                return BadRequest("Insira um usuario Valido");

            var admino = await admin.Incluir(adminDTO);
            return Ok(admino);
        }

        [HttpPut("Alterar")]
        public async Task<IActionResult> Alterar(AdminDTO adminDTO)
        {
            var adminexiste = await admin.ObterPorId(adminDTO.Id);
            if (adminexiste == null || adminexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await admin.Alterar(adminexiste);
            return Ok(adminexiste);
        }

        [HttpDelete("Excluir")]
        public async Task<IActionResult> Excluir(int id)
        {
            var admino = await admin.ObterPorId(id);
            if (admino.Id <= 0 || admino == null)
                return NotFound("Insira um Id Valido");
            await admin.Excluir(admino.Id);
            return Ok("Admin Excluido com Sucesso");
        }

        [HttpGet("ObterPorId")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var admino = await admin.ObterPorId(id);
            if (admino.Id <= 0 || admino == null)
                return NotFound("Insira um Id Valido");
            return Ok(admino);

        }
        [HttpGet("ObterTodos")]
        public async Task<IActionResult> ObterTodos()
        {
            var admins = await admin.ObterTodosAsync();
            return Ok(admins);
        }

    }
}
