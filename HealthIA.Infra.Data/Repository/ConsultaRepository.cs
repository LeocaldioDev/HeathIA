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
    public class ConsultaRepository : IConsultaRepository
    {
        private readonly AppDataBase _context;
        public ConsultaRepository(AppDataBase context)
        {
            _context = context;
        }
        public async Task<Consulta> Alterar(Consulta consulta)
        {
            var consultaId = await _context.Consultas.FindAsync(consulta.Id);
            _context.Consultas.Update(consultaId);
            await _context.SaveChangesAsync();
            return consultaId;


        }

        public async  Task<Consulta> Excluir(int consulta)
        {
           var consultaId = await _context.Consultas.FindAsync(consulta);
            _context.Consultas.Remove(consultaId);
            await _context.SaveChangesAsync();
            return consultaId;  
        }

        public async  Task<Consulta> Incluir(Consulta consulta)
        {
           var consultaId = await _context.Consultas.AddAsync(consulta);
            await _context.SaveChangesAsync();
            return consultaId.Entity;

        }

        public async Task<Consulta> ObterPorId(int id)
        {
            var consulta =  await _context.Consultas.FirstOrDefaultAsync (x=>x.Id==id);
            return consulta;
        }

        public async Task<PagedList<Consulta>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var query = _context.Consultas.AsQueryable();
            return await PaginationHelper.CreateAsync<Consulta>(query, PageNumber, PageSize);
        }
    }
}
