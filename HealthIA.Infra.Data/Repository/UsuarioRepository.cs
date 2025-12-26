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
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDataBase _context;
        public UsuarioRepository(AppDataBase context)
        {
            _context = context;
        }
        public async Task<Usuario> Alterar(Usuario usuario)
        {
           var local = _context.Usuarios.Local.FirstOrDefault(x=>x.Id == usuario.Id);
              if(local != null)
                {
                _context.Entry(local).State = EntityState.Detached;
            }
              if(usuario.SenhaSalt ==null || usuario.SenhaHash == null)
            {
                var passwordCriptografado = await _context.Usuarios.
                    AsNoTracking().
                    Select(x => new { x.SenhaHash, x.SenhaSalt }).
                    FirstOrDefaultAsync();
                usuario.SetSenha(passwordCriptografado.SenhaHash, passwordCriptografado.SenhaSalt);
            }
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> Excluir(int usuarioId)
        {
            var usuarioExistente =  _context.Usuarios.Find(usuarioId);
            _context.Usuarios.Remove(usuarioExistente);
            await _context.SaveChangesAsync();
            return usuarioExistente;
        }

        public async Task<Usuario> Incluir(Usuario usuario)
        {
           await _context.Usuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }


        public async Task<Usuario?> ObterPorId(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Paciente)
                .Include(u => u.medico)
                .Include(u => u.admin)
                .FirstOrDefaultAsync(u => u.Id == id);
        }



        public async Task<PagedList<Usuario>> ObterTodosAsync(int PageNumber, int PageSize)
        {
            var query = _context.Usuarios
                .Include(u => u.Paciente)
                .Include(u => u.medico)
                .Include(u => u.admin)
                .AsQueryable();
            return await PaginationHelper.CreateAsync<Usuario>(query, PageNumber, PageSize);
        }


        public async Task<bool> ExisteUsuarioCadastradoAsync()
        {
            return await _context.Usuarios.AnyAsync();
        }

    }
}
