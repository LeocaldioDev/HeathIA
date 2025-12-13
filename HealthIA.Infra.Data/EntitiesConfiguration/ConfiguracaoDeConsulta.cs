using HealthIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ConfiguracaoDeConsulta : IEntityTypeConfiguration<Consulta>
{
    public void Configure(EntityTypeBuilder<Consulta> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Sintomas)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(c => c.DiagnosticoIA)
            .IsRequired()
            .HasMaxLength(5000);

        builder.Property(c => c.DataConsulta)
            .IsRequired();

        builder.Property(c => c.Validacaomedica);

        // Relação 1:N
        builder.HasOne(c => c.Paciente)
               .WithMany(p => p.Consultas)
               .HasForeignKey(c => c.PacienteId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
