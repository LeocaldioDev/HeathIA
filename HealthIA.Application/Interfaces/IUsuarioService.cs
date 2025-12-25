using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<UsuarioregisterDTO> Incluir(UsuarioregisterDTO usuarioDto);
        Task<UsuarioPostDTO> Alterar(UsuarioPostDTO usuarioDto);
        Task<UsuarioDTO> Excluir(int usuarioDtoId);
        Task<UsuarioDTO> ObterPorId(int id);
        Task<PagedList<UsuarioDTO>> ObterTodosAsync(int PageNumber, int PageSize);
        Task<bool> ExisteUsuarioCadastradoAsync();
    }
}
