using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.Repository
{
    public class MedicoRepository : IMedicoRepository
    {
        private readonly AppDataBase _context;

        public MedicoRepository(AppDataBase context)
        {
            _context = context;
        }

        public async Task<Medico> Alterar(Medico medico)
        {
            var medicoexistente = _context.Medicos.Find(medico.Id);
            _context.Medicos.Update(medicoexistente);
            await _context.SaveChangesAsync();
            return medicoexistente;
        }

        public async Task<Medico> Excluir(int medico)
        {
            var medicoid = _context.Medicos.Find(medico);
            _context.Medicos.Remove(medicoid);
            await _context.SaveChangesAsync();
            return medicoid;
        }

        public async Task<Medico> Incluir(Medico medico)
        {
            var clientenovo = await _context.Medicos.AddAsync(medico);
            await _context.SaveChangesAsync();
            return clientenovo.Entity;
        }

        public async Task<Medico> ObterPorId(int id)
        {
            var medico = await _context.Medicos.FirstAsync();
            return medico;
        }

        public async Task<IEnumerable<Medico>> ObterTodosAsync()
        {
            var medicos = await _context.Medicos.ToListAsync();
            return medicos;
        }
    }
}
