using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Services
{
    public class PacienteService : IPacienteService
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IMapper mapper;

       public PacienteService(IPacienteRepository pacienteRepository, IMapper mapper)
        {
            _pacienteRepository = pacienteRepository;
            this.mapper = mapper;
        }

        public Task<PacienteDTO> Alterar(Paciente paciente)
        {
            throw new NotImplementedException();
        }

        public Task<PacienteDTO> Excluir(int paciente)
        {
            throw new NotImplementedException();
        }

        public Task<PacienteDTO> Incluir(Paciente paciente)
        {
            throw new NotImplementedException();
        }

        public Task<PacientePostDTO> ObterPorId(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PacientePostDTO>> ObterTodosAsync()
        {
            throw new NotImplementedException();
        }
    }
}
