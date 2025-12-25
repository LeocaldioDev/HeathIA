using HealthIA.Application.DTOs;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public interface IAdminService
    {
        Task<AdminDTO> Incluir(AdminDTO admin);
        Task<AdminDTO> Alterar(AdminDTO admin);
        Task<AdminDTO> Excluir(int admin);
        Task<AdminDTO> ObterPorId(int id);
        Task<PagedList<AdminDTO>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}

