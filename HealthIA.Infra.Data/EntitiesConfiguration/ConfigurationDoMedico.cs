using HealthIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.EntitiesConfiguration
{
    internal class ConfigurationDoMedico : IEntityTypeConfiguration<Medico>
    {
        public void Configure(EntityTypeBuilder<Medico> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Nome)
                   .IsRequired()
                   .HasMaxLength(100);
            builder.Property(m => m.Email).IsRequired().HasMaxLength(70);

            builder.Property(m => m.IsAdmin).IsRequired().HasMaxLength(20);
        }
    }
}
