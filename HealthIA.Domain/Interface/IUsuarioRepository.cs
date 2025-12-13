using HealthIA.Domain.Entities;
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
        Task<IEnumerable<Usuario>> ObterTodosAsync();
        Task<bool> ExisteUsuarioCadastradoAsync();
    }
}
