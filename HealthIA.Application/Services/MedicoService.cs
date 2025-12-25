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
    public class MedicoService : IMedicoService
    {

        private readonly IMedicoRepository _medicoRepository;
        private readonly IMapper mapper;
        public MedicoService(IMedicoRepository medicoRepository, IMapper mapper)
        {
            _medicoRepository = medicoRepository;
            this.mapper = mapper;
        }
        public async Task<MedicoDTO> Alterar(MedicoDTO medicoDto)
        {
            var PAciente = mapper.Map<Medico>(medicoDto);
            var MedicoAlterado = await _medicoRepository.Alterar(PAciente);
            var medicodto = mapper.Map<MedicoDTO>(MedicoAlterado);
            return medicodto;

        }

        public async Task<MedicoDTO> Excluir(int medico)
        {
            var medicoe = await _medicoRepository.Excluir(medico);
            var cleintedto = mapper.Map<MedicoDTO>(medicoe);
            return cleintedto;
        }

        public async Task<MedicoDTO> Incluir(MedicoDTO medicoDto)
        {
            var PAciente = mapper.Map<Medico>(medicoDto);
            var MedicoAlterado = await _medicoRepository.Incluir(PAciente);
            var medicodto = mapper.Map<MedicoDTO>(MedicoAlterado);
            return medicodto;
        }

        
        public async Task<MedicoDTO> ObterPorId(int id)
        {
            var medicoe = await _medicoRepository.ObterPorId(id);
            var cleintedto = mapper.Map<MedicoDTO>(medicoe);
            return cleintedto;
        }

        public async Task<PagedList<MedicoDTO>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var medicos = await _medicoRepository.ObterTodosAsync(PageNumber,PageSize);
            var cleintedto = mapper.Map<IEnumerable<MedicoDTO>>(medicos);
            return new PagedList<MedicoDTO>(cleintedto, PageNumber, PageSize, medicos.TotalCount);
        }

    }
}
