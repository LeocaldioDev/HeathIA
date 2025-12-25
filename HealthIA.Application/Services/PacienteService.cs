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
    public class PacienteService : IPacienteService
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IMapper mapper;

       public PacienteService(IPacienteRepository pacienteRepository, IMapper mapper)
        {
            _pacienteRepository = pacienteRepository;
            this.mapper = mapper;
        }

        public async Task<PacienteDTO> Alterar(PacienteDTO pacienteDto)
        {
            var PAciente = mapper.Map<Paciente>(pacienteDto);
            var PacienteAlterado = await  _pacienteRepository.Alterar(PAciente);
            var pacientedto = mapper.Map<PacienteDTO>(PacienteAlterado);
            return pacientedto;

        }

        public async Task<PacienteDTO> Excluir(int paciente)
        {
            var pacientee = await _pacienteRepository.Excluir(paciente);
            var cleintedto = mapper.Map<PacienteDTO>(pacientee);
            return cleintedto;
        }

        public async  Task<PacienteDTO> Incluir(PacienteDTO pacienteDto)
        {
            var PAciente = mapper.Map<Paciente>(pacienteDto);
            var PacienteAlterado = await _pacienteRepository.Incluir(PAciente);
            var pacientedto = mapper.Map<PacienteDTO>(PacienteAlterado);
            return pacientedto;
        }

        public async Task<PacientePostDTO> ObterPorIdPost(int id)
        {
            var pacientee = await _pacienteRepository.ObterPorId(id);
            var cleintedto = mapper.Map<PacientePostDTO>(pacientee);
            return cleintedto;
        }
        public async Task<PacienteDTO> ObterPorId(int id)
        {
            var pacientee = await _pacienteRepository.ObterPorId(id);
            var cleintedto = mapper.Map<PacienteDTO>(pacientee);
            return cleintedto;
        }

        public async Task<PagedList<PacientePostDTO>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var pacientes = await _pacienteRepository.ObterTodosAsync(PageNumber,PageSize);
            var cleintedto = mapper.Map<IEnumerable<PacientePostDTO>>(pacientes);
            return new PagedList<PacientePostDTO>(cleintedto, PageNumber, PageSize, pacientes.TotalCount);
        }
    }
}
