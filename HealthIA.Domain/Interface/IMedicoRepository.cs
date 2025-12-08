using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Interface
{
    public interface IMedicoRepository
    {
        Task<Medico> Incluir(Medico medico);
        Task<Medico> Alterar(Medico medico);
        Task<Medico> Excluir(int medico);
        Task<Medico> ObterPorId(int id);
        Task<IEnumerable<Medico>> ObterTodosAsync();
    }
}
