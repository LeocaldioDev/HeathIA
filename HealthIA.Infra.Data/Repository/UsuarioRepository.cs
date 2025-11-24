using HealthIA.Domain.Entities;
using HealthIA.Domain.Interface;
using HealthIA.Infra.Data.Context;
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
           var usuarioExistente = _context.Usuarios.Find(usuario.Id);
            _context.Usuarios.Update(usuarioExistente);
            await _context.SaveChangesAsync();
            return usuarioExistente;
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

        public Task<Usuario> Login(string email, string senha)
        {
            throw new NotImplementedException();
        }

        public async Task<Usuario> ObterPorId(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            return usuario;
        }


        public async Task<IEnumerable<Usuario>> ObterTodosAsync()
        {
          var usuarios = await _context.Usuarios.ToListAsync();
            return usuarios;
        }
    }
}
