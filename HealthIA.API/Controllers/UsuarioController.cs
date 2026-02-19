using HealthIA.API.Extensions;
using HealthIA.API.Models;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;
using HealthIA.Domain.Account;
using HealthIA.Domain.Entities;
using HealthIA.Infra.Ioc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : Controller
    {
        private readonly IUsuarioService _usuarioService;
        private readonly IAuthenticate _Authenticateservice;

        public UsuarioController(IUsuarioService __usuarioService, IAuthenticate authenticateService)
        {
            this._usuarioService = __usuarioService;
            this._Authenticateservice = authenticateService;
        }



        [HttpPost ("Register")]
        public async Task<ActionResult<UserToken>> Incluir(UsuarioregisterDTO user)
        {

            if (user == null)
            {
                return BadRequest("Campos vazios ou incompletos!");
            
            }
            var emailExiste = await _Authenticateservice.UserExists(user.Email);

            if (emailExiste)
            {
                return BadRequest("este email ja possui um cadastro");
            }
            
            else
            {
                if (User.FindFirst(ClaimTypes.NameIdentifier) == null)
                {
                    return Unauthorized("Acesso negado");

                }

                var UsuarioId = User.GetId();
                var usuarioLogado = await _usuarioService.ObterPorId(UsuarioId);
                if(usuarioLogado == null || usuarioLogado.Role!=UserRole.Admin)
                {
                    return Unauthorized("voce não tem permissão para incluir novos Usuarios.");
                }
            }

                var usuario = await _usuarioService.Incluir(user);
                if (usuario == null)
                {
                    return BadRequest("Ocorreu um erro ao cadastrar");
                }

                    var token = _Authenticateservice.GenerateToken(usuario.Id, usuario.Email, usuario.Role);

                return new UserToken
                {
                    Token = token,
                };
        }




        [HttpPost("login")]

        public async Task<ActionResult<UserToken>> Selecionar(LoginModel loginModel)
        {
            var existe = await _Authenticateservice.UserExists(loginModel.Email);

            if (!existe)
            {
                return Unauthorized("Usuario nao existe");
            }

            var resultado = await _Authenticateservice.AuthenticateUser(loginModel.Email, loginModel.Senha);
            if (!resultado)
            {
                return Unauthorized("Usuario ou senha invalida");
            }
            var usuario = await _Authenticateservice.GetUserByEmail(loginModel.Email);
            int IdElement = 0;
            if (usuario.Role == UserRole.Admin)
            {
                IdElement = usuario.admin.Id;
            }
            else if (usuario.Role == UserRole.Medico)
            {
                IdElement = usuario.medico.Id;
            }
            else if(usuario.Role == UserRole.Paciente)
            {
                IdElement = usuario.Paciente.Id;
            }
            else
            {
                IdElement = 0;
            }

            var token = _Authenticateservice.GenerateToken(usuario.Id, usuario.Email, usuario.Role);

            return new UserToken
            {
                Token = token,
                Role = usuario.Role,
                email = usuario.Email,
                idElement = IdElement
            };
        }


        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {

            return NoContent(); 
        }


        [HttpDelete("Excluir/{id:int}")]
        //[Authorize]
        public async Task<ActionResult> Excluir(int id)
        {
            //if (User.FindFirst(ClaimTypes.NameIdentifier) == null)
            //{
            //    return Unauthorized("Acesso negado");
            //}

            //var usuarioId = User.GetId();
            var usuarioLogado = await _usuarioService.ObterPorId(id);
            //if (usuarioLogado == null || usuarioLogado.Role!= UserRole.Admin)
            //{
            //    return Unauthorized("Voce não tem permissão para excluir usuarios");
            //}

            var usuarioExcluido = await _usuarioService.Excluir(id);
            if (usuarioExcluido == null)
            {
                return BadRequest("Ocorreu um erro ao excluir o usuario");
            }
            return Ok("Usuario excluido com sucesso!");
        }



        [HttpPut("Alterar")]
        [Authorize]
        public async Task<ActionResult> Alterar(UsuarioPostDTO usuarioPutDTO)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null)
            {
                return Unauthorized("Acesso negado");
            }

            var usuarioId = User.GetId();
            var usuarioLogado = await _usuarioService.ObterPorId(usuarioId);

            if (usuarioLogado.Role != UserRole.Admin && usuarioLogado.Id != usuarioPutDTO.Id)
            {
                return Unauthorized("Voce não tem permissão para alterar este usuario");
            }
            if (usuarioLogado.Role != UserRole.Admin && usuarioPutDTO.Id == usuarioId && usuarioPutDTO.Role == UserRole.Admin)
            {
                return Unauthorized("Voce não tem permissão para se definir como administrador");
            }

            var usuarioAlterado = await _usuarioService.Alterar(usuarioPutDTO);
            if (usuarioAlterado == null)
            {
                return BadRequest("Ocorreu um erro ao Alterar o usuario");
            }
            return Ok(new { message = "Usuario alterado com sucesso!" });
        }





        [HttpGet("ObterPorId/{id:int}")]
        [Authorize]
        public async Task<ActionResult> GetById(int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null)
            {
                return Unauthorized("Acesso negado");
            }

            var usuarioId = User.GetId();
            var usuarioLogado = await _usuarioService.ObterPorId(usuarioId);

            if (id == 0)
                id = usuarioId;



            if (usuarioLogado.Role != UserRole.Admin && usuarioLogado.Id != id)
            {
                return Unauthorized("Voce não tem permissão para acessar este usuario");
            }

            var usuario = await _usuarioService.ObterPorId(id);
            if (usuario == null)
            {
                return NotFound("Usuario nao encontrado");
            }


            return Ok(usuario);


        }

        [HttpGet("ObterTodos")]
        //[Authorize]
        public async Task<ActionResult> GetAll([FromQuery] PaginationParams paginationParams)
        {
            var usuarios = await _usuarioService.ObterTodosAsync(paginationParams.PageNumber,paginationParams.PageSize);
            if (usuarios == null || !usuarios.Any())
            {
                return NotFound("Nenhum usuario encontrado");
            }
            Response.AddPaginationHeader(new PaginationHeader
                (
                usuarios.CurrentPage,
                usuarios.Pagesize,
                usuarios.TotalCount,
                usuarios.TotalPages
                
                
                ));
            return Ok(usuarios);
        }
    }

    }
