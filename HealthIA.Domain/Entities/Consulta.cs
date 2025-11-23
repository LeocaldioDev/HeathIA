using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Consulta
    {
        public int Id { get;private  set; }
        public  string Sintomas { get; private set; }
        public string DiagnosticoIA { get; private set; }
        public DateTime DataConsulta { get; private set; }
        public Paciente Paciente { get;private set; }



        public Consulta(int id,string sintomas, string diagnosticoIA, DateTime dataConsulta, Paciente paciente)
        {
            DomainExceptionValidation.When(id < 0, "Id da consulta inválido.");
            this.Id = id;
            Validacao(sintomas, diagnosticoIA, dataConsulta, paciente);
        }

        public Consulta(string sintomas, string diagnosticoIA, DateTime dataConsulta, Paciente paciente)
        {
            Validacao(sintomas, diagnosticoIA, dataConsulta, paciente);
        }


        public void Validacao(string sintomas, string diagnosticoIA, DateTime dataConsulta, Paciente paciente)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(sintomas),"Sintomas inválidos. Sintomas não podem ser nulos ou vazios.");
            DomainExceptionValidation.When(string.IsNullOrEmpty(diagnosticoIA), "Diagnóstico inválido. Diagnóstico não pode ser nulo ou vazio.");
            DomainExceptionValidation.When(dataConsulta < DateTime.Now, "Data da consulta inválida. Data da consulta não pode ser nula.");
            DomainExceptionValidation.When(paciente == null, "Paciente inválido. Paciente não pode ser nulo.");
            this.Sintomas = sintomas;
            this.DiagnosticoIA = diagnosticoIA;
            this.DataConsulta = dataConsulta;
            this.Paciente = paciente;
        }

    }
}
