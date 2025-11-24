using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Data.Context;
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
            var pacienteexistente = _context.Pacientes.Find(paciente.Id);
            _context.Pacientes.Update(pacienteexistente);
            await _context.SaveChangesAsync();
            return pacienteexistente;
        }

        public async Task<Paciente> Excluir(int paciente)
        {
            var pacienteid = _context.Pacientes.Find(paciente);
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

        public async Task<Paciente> ObterPorId(int id)
        {
            var paciente =  await  _context.Pacientes.Include(c => c.Consultas).FirstAsync();
            return paciente;
        }

        public async Task<IEnumerable<Paciente>> ObterTodosAsync()
        {
           var pacientes = await _context.Pacientes.Include(c=>c.Consultas).ToListAsync();
              return pacientes;
        }
    }
}
