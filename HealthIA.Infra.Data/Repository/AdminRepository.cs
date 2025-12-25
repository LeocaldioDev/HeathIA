using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Domain.Pagination;
using HealthIA.Infra.Data.Context;
using HealthIA.Infra.Data.Helper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDataBase _context;
        public AdminRepository(AppDataBase context)
        {
            _context = context;
        }
        public async Task<Admin> Alterar(Admin admin)
        {
            var adminexistente =await  _context.Admins.FindAsync(admin.Id);
            _context.Admins.Update(adminexistente);
            await _context.SaveChangesAsync();
            return adminexistente;
        }

        public async Task<Admin> Excluir(int admin)
        {
            var adminid = await _context.Admins.FindAsync(admin);
            _context.Admins.Remove(adminid);
            await _context.SaveChangesAsync();
            return adminid;
        }

        public async Task<Admin> Incluir(Admin admin)
        {
            var clientenovo = await _context.Admins.AddAsync(admin);
            await _context.SaveChangesAsync();
            return clientenovo.Entity;
        }

        public async Task<Admin> ObterPorId(int id)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(x=>x.Id ==id);
            return admin;
        }

        public async Task<PagedList<Admin>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var query = _context.Admins.AsQueryable();

            return await PaginationHelper.CreateAsync<Admin>(query, PageNumber, PageSize);
        }
    }
}
