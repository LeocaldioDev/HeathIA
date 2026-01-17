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
    public class PacienteRepository : IPacienteRepository
    {
        private readonly AppDataBase _context;
        public PacienteRepository(AppDataBase context)
        {
            _context = context;
        }
        public async Task<Paciente> Alterar(Paciente paciente)
        {
            var local = _context.Pacientes.Local.FirstOrDefault(x => x.Id == paciente.Id);
            if (local != null)
            {
                _context.Entry(local).State = EntityState.Detached;
            }
            _context.Pacientes.Update(paciente);
            await _context.SaveChangesAsync();
            return paciente;
        }

        public async Task<Paciente> Excluir(int paciente)
        {
            var pacienteid = await _context.Pacientes.FindAsync(paciente);
            _context.Pacientes.Remove(pacienteid);
            await _context.SaveChangesAsync();
            return pacienteid;
        }

        public async Task<Paciente> Incluir(Paciente paciente)
        {
            var clientenovo = await _context.Pacientes.AddAsync(paciente);
            await _context.SaveChangesAsync();
            return clientenovo.Entity;
        }

        public async Task<Paciente?> ObterPorId(int id)
        {
            var paciente =  await  _context.Pacientes.Include(c => c.Consultas).FirstOrDefaultAsync(x => x.Id == id);
            return paciente;
        }

        public async Task<PagedList<Paciente>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var query = _context.Pacientes.Include(c => c.Consultas).AsQueryable();
            return await PaginationHelper.CreateAsync<Paciente>(query, PageNumber, PageSize);
        }
    }
}
