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
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IMapper mapper;
        public AdminService(IAdminRepository adminRepository, IMapper mapper)
        {
            _adminRepository = adminRepository;
            this.mapper = mapper;
        }
        public async Task<AdminDTO> Alterar(AdminDTO adminDto)
        {
            var PAciente = mapper.Map<Admin>(adminDto);
            var AdminAlterado = await _adminRepository.Alterar(PAciente);
            var admindto = mapper.Map<AdminDTO>(AdminAlterado);
            return admindto;

        }

        public async Task<AdminDTO> Excluir(int admin)
        {
            var admine = await _adminRepository.Excluir(admin);
            var cleintedto = mapper.Map<AdminDTO>(admine);
            return cleintedto;
        }

        public async Task<AdminDTO> Incluir(AdminDTO adminDto)
        {
            var PAciente = mapper.Map<Admin>(adminDto);
            var AdminAlterado = await _adminRepository.Incluir(PAciente);
            var admindto = mapper.Map<AdminDTO>(AdminAlterado);
            return admindto;
        }


        public async Task<AdminDTO> ObterPorId(int id)
        {
            var admine = await _adminRepository.ObterPorId(id);
            var cleintedto = mapper.Map<AdminDTO>(admine);
            return cleintedto;
        }

        public async Task<PagedList<AdminDTO>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var admins = await _adminRepository.ObterTodosAsync(PageNumber, PageSize);
            var cleintedto = mapper.Map<IEnumerable<AdminDTO>>(admins);
            return new PagedList<AdminDTO>(cleintedto, PageNumber, PageSize, admins.TotalCount);
        }
    }
}
