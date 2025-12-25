using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public  interface IPacienteService
    {
        Task<PacienteDTO> Incluir(PacienteDTO pacienteDto);
        Task<PacienteDTO> Alterar(PacienteDTO pacienteDto);
        Task<PacienteDTO> Excluir(int paciente);
        Task<PacientePostDTO> ObterPorIdPost(int id);
        Task<PacienteDTO> ObterPorId(int id);
        Task<PagedList<PacientePostDTO>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}
