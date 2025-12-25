using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Interface
{
    public interface IPacienteRepository
    {
        Task<Paciente> Incluir(Paciente paciente);
        Task<Paciente> Alterar(Paciente paciente);
        Task<Paciente> Excluir(int paciente);
        Task<Paciente> ObterPorId(int id);
        Task<PagedList<Paciente>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}
