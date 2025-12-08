using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class UsuarioController : Controller
    {
        private readonly IUsuarioService usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            this.usuarioService = usuarioService;
        }


        
        [HttpPost ("Incluir")]
        public async Task<ActionResult> Incluir(UsuarioDTO user)
        {
            if (user == null)
            {
                return BadRequest("Campos vazios ou incompletos!");
            
            }
           var usuario = await usuarioService.Incluir(user);

            return Ok(usuario);
        
        }

        [HttpDelete]
        public async Task<ActionResult> Remove(int id)
        {
            var usuario = await usuarioService.ObterPorId(id);
            if (usuario == null || usuario.Id <= 0)
                return BadRequest("adiciona un ID valido");

            await usuarioService.Excluir(usuario.Id);
            return Ok("Removido com sucesso");
        }



        [HttpPut("Alterar")]
        public async Task<ActionResult> Update(UsuarioDTO usuarioDTO)
        {
            var usuario = await usuarioService.ObterPorId(usuarioDTO.Id);
            if(usuario ==null || usuario.Id <=0)
                return NotFound("Usuario não encontrado");

            await usuarioService.Alterar(usuario);
            return Ok(usuario);
        }

        [HttpGet("ObterPorId")]
        public async Task<ActionResult> GetById(int id)
        {
            var usuario = await usuarioService.ObterPorId(id);
            if (usuario == null)
                return BadRequest("adiciona un ID valido");
            
            return Ok(usuario);
        }

        [HttpGet("ObterTodos")]
        public async Task<ActionResult> GetAll()
        {
            var usuarios = await usuarioService.ObterTodosAsync();
            return Ok(usuarios);
        }
    }
    }
