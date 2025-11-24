using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
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

        public Task<UsuarioDTO> Alterar(Usuario usuario)
        {
            throw new NotImplementedException();
        }

        public Task<UsuarioDTO> Excluir(int usuarioId)
        {
            throw new NotImplementedException();
        }

        public Task<UsuarioDTO> Incluir(Usuario usuario)
        {
            throw new NotImplementedException();
        }

        public Task<UsuarioDTO> Login(string email, string senha)
        {
            throw new NotImplementedException();
        }

        public Task<UsuarioDTO> ObterPorId(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<UsuarioDTO>> ObterTodosAsync()
        {
            throw new NotImplementedException();
        }
    }
}
