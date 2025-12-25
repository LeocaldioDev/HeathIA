using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Interface
{
    public interface IUsuarioRepository
    {
        Task<Usuario> Incluir(Usuario usuario);
        Task<Usuario> Alterar(Usuario usuario);
        Task<Usuario> Excluir(int usuarioId);
        Task<Usuario> ObterPorId(int id);
        Task<PagedList<Usuario>> ObterTodosAsync(int PageNumber, int PageSize);
        Task<bool> ExisteUsuarioCadastradoAsync();
    }
}
