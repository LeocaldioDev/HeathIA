using HealthIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ConfiguracaoDoPaciente : IEntityTypeConfiguration<Paciente>
{
    public void Configure(EntityTypeBuilder<Paciente> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nome).IsRequired().HasMaxLength(100);
        builder.Property(p => p.DataNascimento).IsRequired();
        builder.Property(p => p.Sexo).IsRequired();
        builder.Property(p => p.Email).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Telefone).HasMaxLength(20);
    }
}
