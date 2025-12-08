using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
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
        Task<IEnumerable<PacientePostDTO>> ObterTodosAsync();
    }
}
