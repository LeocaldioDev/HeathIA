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
            return usuarioDto;
        }

        public async Task<PagedList<UsuarioDTO>> ObterTodosAsync(int PageNumber, int PageSize)
        {
           var Usuarios = await _usuarioRepository.ObterTodosAsync(PageNumber, PageSize);
            var usuarioDtos = mapper.Map<IEnumerable<UsuarioDTO>>(Usuarios);
            return new PagedList<UsuarioDTO>(usuarioDtos, PageNumber, PageSize, Usuarios.TotalCount);
        }

       
    }
}
