using HealthIA.Domain.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public byte[] SenhaHash { get; private set; }
        public byte[] SenhaSalt { get; private set; }
        public bool IsAdmin { get; private set; }

        public Usuario(int id, string nome,string email, bool isadmin) 
        {
            DomainExceptionValidation.When(id < 0, "Id do usuário inválido.");
            this.Id = id;
            Validacao(nome, email, isadmin);
        }
        public Usuario( string nome,string email, bool isadmin) 
        {
            Validacao(nome, email, isadmin);
        }
        public void setAdmin(bool isadmin) 
        {
            this.IsAdmin = isadmin;
        }
        
        public void SetSenha(byte[] senhaHash, byte[] senhaSalt) 
        {
            this.SenhaHash = senhaHash;
            this.SenhaSalt = senhaSalt;
        }


        public void Validacao(string nome, string email, bool isadmin) 
        {
        DomainExceptionValidation.When(string.IsNullOrEmpty(nome),"Nome do usuário inválido. O nome é obrigatório.");
        DomainExceptionValidation.When(nome.Length<3,"O Nome esta muito curto");
        DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do usuário inválido. O email é obrigatório.");
        DomainExceptionValidation.When(email.Length < 5, "O email esta muito curto");

            this.Nome = nome;
            this.Email = email;
            this.IsAdmin = false;


        }

    }
}
