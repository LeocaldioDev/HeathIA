using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<UsuarioDTO> Incluir(UsuarioDTO usuarioDto);
        Task<UsuarioDTO> Alterar(UsuarioDTO usuarioDto);
        Task<UsuarioDTO> Excluir(int usuarioDtoId);
        Task<UsuarioDTO> ObterPorId(int id);
        Task<IEnumerable<UsuarioDTO>> ObterTodosAsync();
        Task<bool> ExisteUsuarioCadastradoAsync();
    }
}
