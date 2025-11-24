using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Interfaces
{
    public  interface IPacienteService
    {
        Task<PacienteDTO> Incluir(Paciente paciente);
        Task<PacienteDTO> Alterar(Paciente paciente);
        Task<PacienteDTO> Excluir(int paciente);
        Task<PacientePostDTO> ObterPorId(int id);
        Task<IEnumerable<PacientePostDTO>> ObterTodosAsync();
    }
}
