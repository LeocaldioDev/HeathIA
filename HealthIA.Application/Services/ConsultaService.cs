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

        public async Task<ConsultaDTO> Alterar(ConsultaDTO consultaDto)
        {
            var consulta = mapper.Map<Consulta>(consultaDto);
            var consultaalter = await _consultaRepository.Alterar(consulta);
            var consultadto = mapper.Map<ConsultaDTO>(consultaalter);
            return consultadto;
        }

        public async Task<ConsultaDTO> Excluir(int consulta)
        {
            var consultaa = await _consultaRepository.Excluir(consulta);
            var clienteDto = mapper.Map<ConsultaDTO>(consultaa);
            return clienteDto;
        }

        public async Task<ConsultaDTO> Incluir(ConsultaDTO consultaDto)
        {
            var consulta = mapper.Map<Consulta>(consultaDto);
            var consultaalter = await _consultaRepository.Incluir(consulta);
            var consultadto = mapper.Map<ConsultaDTO>(consultaalter);
            return consultadto;
        }

        public async Task<ConsultaDTO> ObterPorId(int id)
        {
            var consultaa = await _consultaRepository.ObterPorId(id);
            var clienteDto = mapper.Map<ConsultaDTO>(consultaa);
            return clienteDto;
        }

        public async Task<IEnumerable<ConsultaDTO>> ObterTodosAsync()
        {
            var consultaa = await _consultaRepository.ObterTodosAsync();
            var clienteDto = mapper.Map<IEnumerable<ConsultaDTO>>(consultaa);
            return clienteDto;
        }
    }
}
