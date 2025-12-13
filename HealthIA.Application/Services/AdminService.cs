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

        public async Task<IEnumerable<AdminDTO>> ObterTodosAsync()
        {
            var admins = await _adminRepository.ObterTodosAsync();
            var cleintedto = mapper.Map<IEnumerable<AdminDTO>>(admins);
            return cleintedto;
        }
    }
}
