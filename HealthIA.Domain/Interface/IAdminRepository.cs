using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Interface
{
    public interface IAdminRepository
    {
        Task<Admin> Incluir(Admin admin);
        Task<Admin> Alterar(Admin admin);
        Task<Admin> Excluir(int admin);
        Task<Admin> ObterPorId(int id);
        Task<PagedList<Admin>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}
