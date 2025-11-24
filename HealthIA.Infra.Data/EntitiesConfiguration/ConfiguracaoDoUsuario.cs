using HealthIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.EntitiesConfiguration
{
    internal class ConfiguracaoDoUsuario : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Nome).IsRequired().HasMaxLength(100);
            builder.Property(u => u.Email).IsRequired().HasMaxLength(100);
            builder.Property(u => u.SenhaHash).IsRequired();
            builder.Property(u => u.SenhaSalt).IsRequired();
            builder.Property(u => u.IsAdmin).IsRequired();

        }
    }
}
