using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Admin
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string IsAdmin { get; private set; } = "admin";
        public Usuario Usuario { get; set; }

        public Admin()
        {
        }

        public Admin(int id, string nome, string email)
        {
            DomainExceptionValidation.When(id < 0, "Id do admin inválido.");
            validacao(nome, email);
            Id = id;
            Nome = nome;
            Email = email;
        }

        public Admin(string nome, string email)
        {
            validacao(nome, email);
            Nome = nome;
            Email = email;
        }

        public void validacao(string nome, string email)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do admin inválido. O nome é obrigatório.");
            DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do admin inválido. O email é obrigatório.");
            Nome = nome;
            Email = email;
        }
    }
}
