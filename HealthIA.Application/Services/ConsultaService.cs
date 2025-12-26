using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Application.Interfaces;
using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Domain.Pagination;
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

        public async Task<ConsultaPostDTO> Alterar(ConsultaPostDTO consultaDto)
        {
            var consulta = mapper.Map<Consulta>(consultaDto);
            var consultaalter = await _consultaRepository.Alterar(consulta);
            var consultadto = mapper.Map<ConsultaPostDTO>(consultaalter);
            return consultadto;
        }

        public async Task<ConsultaPostDTO> Excluir(int consulta)
        {
            var consultaa = await _consultaRepository.Excluir(consulta);
            var clienteDto = mapper.Map<ConsultaPostDTO>(consultaa);
            return clienteDto;
        }

        public async Task<ConsultaPostDTO> Incluir(ConsultaDTO consultaDto)
        {
            var consulta = mapper.Map<Consulta>(consultaDto);
            var consultaalter = await _consultaRepository.Incluir(consulta);
            var consultadto = mapper.Map<ConsultaPostDTO>(consultaalter);
            return consultadto;
        }

        public async Task<ConsultaPostDTO> ObterPorId(int id)
        {
            var consultaa = await _consultaRepository.ObterPorId(id);
            var clienteDto = mapper.Map<ConsultaPostDTO>(consultaa);
            return clienteDto;
        }
        public async Task<ConsultaPostDTO> ObterPorIdsempost(int id)
        {
            var consultaa = await _consultaRepository.ObterPorId(id);
            var clienteDto = mapper.Map<ConsultaPostDTO>(consultaa);
            return clienteDto;
        }

        public async Task<PagedList<ConsultaPostDTO>> ObterTodosAsync(int idpaciente,int PageNumber, int PageSize)
        {
            var consultaa = await _consultaRepository.ObterTodosAsync(idpaciente, PageNumber,PageSize);
            var clienteDto = mapper.Map<IEnumerable<ConsultaPostDTO>>(consultaa);
            return new PagedList<ConsultaPostDTO>(clienteDto, PageNumber, PageSize, consultaa.TotalCount);
        }
    }
}
