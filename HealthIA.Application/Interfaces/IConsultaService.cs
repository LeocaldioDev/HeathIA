using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public  interface IConsultaService
    {
        Task<ConsultaDTO> Incluir(ConsultaDTO consultaDto);
        Task<ConsultaDTO> Alterar(ConsultaDTO consultaDto);
        Task<ConsultaDTO> Excluir(int consulta);
        Task<ConsultaDTO> ObterPorId(int id);
        Task<IEnumerable<ConsultaDTO>> ObterTodosAsync();
    }
}
