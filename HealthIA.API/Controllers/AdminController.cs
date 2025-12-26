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
    public class AdminController : ControllerBase
    {
        private readonly IAdminService admin;
        public AdminController(IAdminService adminService)
        {
            this.admin = adminService;
        }

        [HttpPost("Incluir")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Incluir(AdminDTO adminDTO)
        {
            if (adminDTO == null)
                return BadRequest("Insira um usuario Valido");

            var admino = await admin.Incluir(adminDTO);
            return Ok(admino);
        }

        [HttpPut("Alterar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Alterar(AdminDTO adminDTO)
        {
            var adminexiste = await admin.ObterPorId(adminDTO.Id);
            if ( adminexiste == null|| adminexiste.Id <= 0)
                return NotFound("Insira um usuario Valido");
            await admin.Alterar(adminexiste);
            return Ok(adminexiste);
        }


        [HttpDelete("Excluir/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Excluir(int id)
        {
            var admino = await admin.ObterPorId(id);
            if (admino == null || admino.Id <= 0)
                return NotFound("Insira um Id Valido");
            await admin.Excluir(admino.Id);
            return Ok("Admin Excluido com Sucesso");
        }

        [HttpGet("ObterPorId/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var admino = await admin.ObterPorId(id);
            if ( admino == null || admino.Id <= 0)
                return NotFound("Nenhum admin encontrado");
            return Ok(admino);

        }
        [HttpGet("ObterTodos")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ObterTodos(PaginationParams paginationParams)
        {
            var admins = await admin.ObterTodosAsync(paginationParams.PageNumber,paginationParams.PageSize);
            if(admins == null || !admins.Any())
                return NotFound("Nenhum admin encontrado");

            Response.AddPaginationHeader(new PaginationHeader
                (
                admins.CurrentPage,
                admins.Pagesize,
                admins.TotalCount,
                admins.TotalPages


                ));
            return Ok(admins);
        }

    }
}
