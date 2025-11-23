using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Paciente
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public DateTime DataNascimento { get; private set; }
        public string Sexo { get; private set; }
        public string Email { get; private set; }
        public string Telefone { get; private set; }

        public Paciente(int id,string nome, DateTime dataNascimento, string sexo, string email, string telefone)
        {
            DomainExceptionValidation.When(id < 0, "Id do paciente inválido.");

            this.Id = id;
            Validacao(nome, dataNascimento, sexo, email, telefone);
        }
        public Paciente(string nome, DateTime dataNascimento, string sexo, string email, string telefone)
        {
            Validacao(nome, dataNascimento, sexo, email, telefone);
        }

        public void Validacao(string nome, DateTime dataNascimento, string sexo, string email, string telefone)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do paciente inválido. O nome é obrigatório.");
            DomainExceptionValidation.When(dataNascimento < DateTime.Now, "Data de nascimento inválida. A data de nascimento é obrigatória.");
            DomainExceptionValidation.When(string.IsNullOrEmpty(sexo), "Sexo do paciente inválido. O sexo é obrigatório.");
            DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do paciente inválido. O email é obrigatório.");
            this.Nome = nome;
            this.DataNascimento = dataNascimento;
            this.Sexo = sexo;
            this.Email = email;
            this.Telefone = telefone;
        }
    }
}
