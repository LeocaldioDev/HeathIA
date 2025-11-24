using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<UsuarioDTO> Incluir(Usuario usuario);
        Task<UsuarioDTO> Alterar(Usuario usuario);
        Task<UsuarioDTO> Excluir(int usuarioId);
        Task<UsuarioDTO> Login(string email, string senha);
        Task<UsuarioDTO> ObterPorId(int id);
        Task<IEnumerable<UsuarioDTO>> ObterTodosAsync();
    }
}
