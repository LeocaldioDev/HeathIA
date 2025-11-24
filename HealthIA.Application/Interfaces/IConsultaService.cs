using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public  interface IConsultaService
    {
        Task<ConsultaDTO> Incluir(Consulta consulta);
        Task<ConsultaDTO> Alterar(Consulta consulta);
        Task<ConsultaDTO> Excluir(int consulta);
        Task<ConsultaDTO> ObterPorId(int id);
        Task<IEnumerable<ConsultaDTO>> ObterTodosAsync();
    }
}
