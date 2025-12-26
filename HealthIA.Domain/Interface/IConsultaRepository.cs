using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Interface
{
    public interface IConsultaRepository
    {
     Task<Consulta> Incluir(Consulta consulta);
     Task<Consulta> Alterar(Consulta consulta);
        Task<Consulta> Excluir(int consulta);
        Task<Consulta> ObterPorId(int id);
        Task<PagedList<Consulta>> ObterTodosAsync(int idPaciente, int PageNumber, int PageSize);


    }
}
