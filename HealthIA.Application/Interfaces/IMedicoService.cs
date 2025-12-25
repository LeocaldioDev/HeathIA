using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public interface IMedicoService
    {


        Task<MedicoDTO> Incluir(MedicoDTO medico);
        Task<MedicoDTO> Alterar(MedicoDTO medico);
        Task<MedicoDTO> Excluir(int medico);
        Task<MedicoDTO> ObterPorId(int id);
        Task<PagedList<MedicoDTO>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}
