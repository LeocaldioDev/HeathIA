using HealthIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.EntitiesConfiguration
{
    internal class ConfigurationAdmin : IEntityTypeConfiguration<Admin>
    {
        public void Configure(EntityTypeBuilder<Admin> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Nome)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasOne(p => p.Usuario)
              .WithOne(u => u.admin)
              .HasForeignKey<Admin>(p => p.UsuarioId)
              .IsRequired();
        }
    }
}
