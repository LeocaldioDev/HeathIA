using HealthIA.Domain.Validation;

namespace HealthIA.Domain.Entities
{
public class Consulta
{
    public int Id { get; private set; }
    public string Sintomas { get; private set; }
    public string DiagnosticoIA { get; private set; }
    public DateTime DataConsulta { get; private set; }

    // Chave estrangeira obrigatória
    public int PacienteId { get; private set; }

    // Navegação
    public Paciente Paciente { get; private set; }

    public Consulta(int id, string sintomas, string diagnosticoIA, DateTime dataConsulta, int pacienteId)
    {
        DomainExceptionValidation.When(id < 0, "Id da consulta inválido.");
        Id = id;
        Validacao(sintomas, diagnosticoIA, dataConsulta, pacienteId);
    }

    public Consulta(string sintomas, string diagnosticoIA, DateTime dataConsulta, int pacienteId)
    {
        Validacao(sintomas, diagnosticoIA, dataConsulta, pacienteId);
    }

    private void Validacao(string sintomas, string diagnosticoIA, DateTime dataConsulta, int pacienteId)
    {
        DomainExceptionValidation.When(string.IsNullOrEmpty(sintomas), "Sintomas inválidos.");
        DomainExceptionValidation.When(string.IsNullOrEmpty(diagnosticoIA), "Diagnóstico inválido.");
        DomainExceptionValidation.When(dataConsulta > DateTime.Now.AddYears(1), "Data futura inválida.");
        DomainExceptionValidation.When(pacienteId <= 0, "Paciente inválido.");

        Sintomas = sintomas;
        DiagnosticoIA = diagnosticoIA;
        DataConsulta = dataConsulta;
        PacienteId = pacienteId;
    }
    }
}
