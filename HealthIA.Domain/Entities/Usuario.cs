using HealthIA.Domain.Validation;

namespace HealthIA.Domain.Entities
{
    public enum UserRole
    {
        Admin = 1,
        Medico = 2,
        Paciente = 3
    }

    public class Usuario
    {
        public int Id { get; private set; }
        public string Email { get; private set; }
        public byte[] SenhaHash { get; private set; }
        public byte[] SenhaSalt { get; private set; }
        public UserRole Role { get; private set; }
        public Paciente Paciente { get; private set; }
        public Admin admin { get; private set; }
        public Medico medico { get; private set; }

        private Usuario() { }

   
        public Usuario(int id, string email, UserRole role)
        {
            DomainExceptionValidation.When(id < 0, "Id do usuário inválido.");
            DomainExceptionValidation.When(!Enum.IsDefined(typeof(UserRole), role), "Nível de acesso inexistente.");

            Id = id;
            Role = role;
            Validacao( email);
        }

        public Usuario( string email, UserRole role)
        {
            DomainExceptionValidation.When(!Enum.IsDefined(typeof(UserRole), role), "Nível de acesso inexistente.");
            Role = role;
            Validacao( email);
        }

        public void SetSenha(byte[] senhaHash, byte[] senhaSalt)
        {
            SenhaHash = senhaHash;
            SenhaSalt = senhaSalt;
        }

        public void SetRole(UserRole role)
        {
            DomainExceptionValidation.When(!Enum.IsDefined(typeof(UserRole), role), "Nível de acesso inexistente.");
            Role = role;
        }

        private void Validacao( string email)
        {
            
            DomainExceptionValidation.When(string.IsNullOrWhiteSpace(email), "Email do usuário inválido. O email é obrigatório.");
            DomainExceptionValidation.When(email.Length < 5, "O email está muito curto.");

           
            Email = email;
        }
    }
}
