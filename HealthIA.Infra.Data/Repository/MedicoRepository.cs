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
    public class MedicoRepository : IMedicoRepository
    {
        private readonly AppDataBase _context;

        public MedicoRepository(AppDataBase context)
        {
            _context = context;
        }

        public async Task<Medico> Alterar(Medico medico)
        {

            var medicoExistente = await _context.Medicos.FindAsync(medico.Id);
            if (medicoExistente == null)
                throw new Exception("Médico não encontrado.");
            if (!string.IsNullOrWhiteSpace(medico.Nome) && medico.Nome != medicoExistente.Nome)
            {
                medicoExistente.validacao(medico.Nome); 
            }

            if (medico.UsuarioId > 0 && medico.UsuarioId != medicoExistente.UsuarioId)
            {
                medicoExistente.setUsuarioID(medico.UsuarioId);
            }

            await _context.SaveChangesAsync();

            return medicoExistente;
        }


        public async Task<Medico> Excluir(int medico)
        {
            var medicoid = await _context.Medicos.FindAsync(medico);
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
            var medico = await _context.Medicos.FirstOrDefaultAsync(x => x.Id == id);
            return medico;
        }

        public async Task<PagedList<Medico>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var query = _context.Medicos.AsQueryable();
            return await PaginationHelper.CreateAsync<Medico>(query, PageNumber, PageSize);
        }
    }
}
