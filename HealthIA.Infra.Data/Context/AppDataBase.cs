using HealthIA.Domain.Entities;
using HealthIA.Infra.Data.EntitiesConfiguration;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.Context
{
    public class AppDataBase : DbContext
    {
        public AppDataBase(DbContextOptions<AppDataBase> options) : base(options)
        {
        }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Consulta> Consultas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Admin> Admins { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
                        base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(AppDataBase).Assembly);
        }


    }
}
