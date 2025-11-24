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
    public class ConsultaService : IConsultaService
    {
        private readonly IConsultaRepository _consultaRepository;
        private readonly IMapper mapper;
        public ConsultaService(IConsultaRepository consultaRepository, IMapper mapper)
        {
            _consultaRepository = consultaRepository;
            this.mapper = mapper;
        }
        public Task<ConsultaDTO> Alterar(Consulta consulta)
        {
            throw new NotImplementedException();
        }

        public Task<ConsultaDTO> Excluir(int consulta)
        {
            throw new NotImplementedException();
        }

        public Task<ConsultaDTO> Incluir(Consulta consulta)
        {
            throw new NotImplementedException();
        }

        public Task<ConsultaDTO> ObterPorId(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ConsultaDTO>> ObterTodosAsync()
        {
            throw new NotImplementedException();
        }
    }
}
