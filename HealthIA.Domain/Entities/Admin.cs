using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Admin
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public int UsuarioId { get; private set; }
        public Usuario Usuario { get;  set; }

      
        public Admin()
        {
        }
        public Admin(int id, string nome, string email, int usuarioId)
        {
            DomainExceptionValidation.When(id < 0, "Id do admin inválido.");
            DomainExceptionValidation.When(usuarioId < 0, "Id do admin inválido.");
            validacao(nome);
            Id = id;
            Nome = nome;
            UsuarioId = usuarioId;
            UsuarioId = usuarioId;
        }

        public Admin(string nome, string email)
        {
            validacao(nome);
            Nome = nome;
        }

        public void validacao(string nome)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do admin inválido. O nome é obrigatório.");
            Nome = nome;
        }
    }
}
