using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Medico
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }

        public int UsuarioId { get; private set; }
        public Usuario Usuario { get;  set; }

        public Medico()
        {
        }
        public Medico(int id, string nome, string email,int usuarioId)
        {
            DomainExceptionValidation.When(id < 0, "Id do médico inválido.");
            DomainExceptionValidation.When(usuarioId< 0, "Id do médico inválido.");
            validacao(nome);
            Id = id;
            UsuarioId = usuarioId;
            Nome = nome;
        }
        public Medico(string nome)
        {
            validacao(nome);
            Nome = nome;
        }



        public void validacao(string nome)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do médico inválido. O nome é obrigatório.");


            Nome = nome;
        }
    }
}
