using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Data.Context;
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
            var consultaId = _context.Consultas.Find(consulta.Id);
            _context.Consultas.Update(consultaId);
            await _context.SaveChangesAsync();
            return consultaId;


        }

        public async  Task<Consulta> Excluir(int consulta)
        {
           var consultaId = _context.Consultas.Find(consulta);
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
            var consulta =  await _context.Consultas.FindAsync (id);
            return consulta;
        }

        public async Task<IEnumerable<Consulta>> ObterTodosAsync()
        {
            var consultas = await _context.Consultas.ToListAsync();
            return consultas;
        }
    }
}
