using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Medico
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string IsAdmin { get; private set; } = "medico";
        public Usuario Usuario { get; set; }

        public Medico()
        {
        }
        public Medico(int id, string nome, string email)
        {
            DomainExceptionValidation.When(id < 0, "Id do médico inválido.");
            validacao(nome, email);
            Id = id;
            Nome = nome;
            Email = email;
        }
        public Medico(string nome, string email)
        {
            validacao(nome, email);
            Nome = nome;
            Email = email;
        }



        public void validacao(string nome, string email)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do médico inválido. O nome é obrigatório.");
            DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do médico inválido. O email é obrigatório.");


            Nome = nome;
            Email = email;
        }
    }
}
