using HealthIA.Domain.Validation;


namespace HealthIA.Domain.Entities
{
    public class Usuario
{
    public int Id { get; private set; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
        //public byte[] SenhaHash { get; private set; }
        // public byte[] SenhaSalt { get; private set; }
    public string IsAdmin { get; private set; } = "cliente";

    private Usuario() { } 

    public Usuario(int id, string nome, string email, string isadmin)
    {
        DomainExceptionValidation.When(id < 0, "Id do usuário inválido.");
        this.Id = id;
        Validacao(nome, email, isadmin);
    }

    public Usuario(string nome, string email, string isadmin)
    {
        Validacao(nome, email, isadmin);
    }

    //public void SetSenha(byte[] senhaHash, byte[] senhaSalt)
    //{
    //    this.SenhaHash = senhaHash;
    //    this.SenhaSalt = senhaSalt;
    //}

        public void setIsAdmin(string isadmin)
        {
            this.IsAdmin = isadmin;
        }   

        public void Validacao(string nome, string email, string isadmin)
    {
        DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do usuário inválido. O nome é obrigatório.");
        DomainExceptionValidation.When(nome.Length < 3, "O Nome está muito curto");
        DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do usuário inválido. O email é obrigatório.");
        DomainExceptionValidation.When(email.Length < 5, "O email está muito curto");

        this.Nome = nome;
        this.Email = email;

        this.IsAdmin = isadmin;
    }
}
}
