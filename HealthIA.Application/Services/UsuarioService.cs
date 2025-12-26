using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IMapper mapper;

        public UsuarioService(IUsuarioRepository usuarioRepository, IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            this.mapper = mapper;
        }

        public async Task<UsuarioPostDTO> Alterar(UsuarioPostDTO usuarioDto)
        {
            var usuario = mapper.Map<Usuario>(usuarioDto);
            if(usuarioDto.password != null)
            {
                using var hmac = new System.Security.Cryptography.HMACSHA256();
                var senhaSalt = hmac.Key;
                var senhaHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(usuarioDto.password));
                usuario.SetSenha(senhaHash, senhaSalt);
            }
            var usuarioEntity = await _usuarioRepository.Alterar(usuario);
            var usuarioDt = mapper.Map<UsuarioPostDTO>(usuarioEntity);
            return usuarioDt;
        }

        public async Task<UsuarioDTO> Excluir(int usuarioId)
        {
            var result = await _usuarioRepository.Excluir(usuarioId);
            var usuarioDto = mapper.Map<UsuarioDTO>(result);
            return usuarioDto;
        }

        public Task<bool> ExisteUsuarioCadastradoAsync()
        {
            throw new NotImplementedException();
        }

        public async  Task<UsuarioregisterDTO> Incluir(UsuarioregisterDTO usuario)
        {
            var usuarioo = mapper.Map<Usuario>(usuario);
            if(usuario.password != null)
            {
                using var hmac = new System.Security.Cryptography.HMACSHA256();
                var senhaSalt = hmac.Key;
                var senhaHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(usuario.password));
                usuarioo.SetSenha(senhaHash, senhaSalt);
            }
         var usuarioEntity = await  _usuarioRepository.Incluir(usuarioo);
            var usuarioDt = mapper.Map<UsuarioregisterDTO>(usuarioEntity);
           return usuarioDt;
        }



        public async Task<UsuarioDTO> ObterPorId(int id)
        {
            var usuario =await  _usuarioRepository.ObterPorId(id);
            var usuarioDto = mapper.Map<UsuarioDTO>(usuario);
            return new UsuarioDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Role = usuario.Role,
                Pacienteid = usuario.Paciente?.Id,
                medicoid = usuario.medico?.Id,
                adminid = usuario.admin?.Id
            };
        }

        public async Task<PagedList<UsuarioDTO>> ObterTodosAsync(int pageNumber, int pageSize)
        {
            var usuarios = await _usuarioRepository.ObterTodosAsync(pageNumber, pageSize);

            var usuariosDto = usuarios.Select(usuario => new UsuarioDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Role = usuario.Role,
                adminid = usuario.admin?.Id,
                medicoid = usuario.medico?.Id,
                Pacienteid = usuario.Paciente?.Id
            });

            return new PagedList<UsuarioDTO>(
                usuariosDto,
                pageNumber,
                pageSize,
                usuarios.TotalCount
            );
        }



    }
}
