using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public  interface IConsultaService
    {
        Task<ConsultaPostDTO> Incluir(ConsultaDTO consultaDto);
        Task<ConsultaPostDTO> Alterar(ConsultaPostDTO consultaDto);
        Task<ConsultaPostDTO> Excluir(int consulta);
        Task<ConsultaPostDTO> ObterPorId(int id);
        Task<ConsultaPostDTO> ObterPorIdsempost(int id);
        Task<PagedList<ConsultaPostDTO>> ObterTodosAsync(int PageNumber, int PageSize);
    }
}
