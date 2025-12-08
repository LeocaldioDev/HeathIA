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
            builder.Property(a => a.Email)
                     .IsRequired()
                     .HasMaxLength(100);
            builder.Property(a => a.IsAdmin)
                     .IsRequired()
                     .HasMaxLength(10);
        }
    }
}
