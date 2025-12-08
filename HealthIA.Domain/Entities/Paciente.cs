using HealthIA.Domain.Validation;


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

    public Usuario Usuario { get; set; }

        // Relação: Paciente tem muitas Consultas
        public ICollection<Consulta> Consultas { get; private set; } = new List<Consulta>();

    public Paciente(int id, string nome, DateTime dataNascimento, string sexo, string email, string telefone)
    {
        DomainExceptionValidation.When(id < 0, "Id do paciente inválido.");
        Id = id;
        Validacao(nome, dataNascimento, sexo, email, telefone);
    }

    public Paciente(string nome, DateTime dataNascimento, string sexo, string email, string telefone)
    {
        Validacao(nome, dataNascimento, sexo, email, telefone);
    }

    private void Validacao(string nome, DateTime dataNascimento, string sexo, string email, string telefone)
    {
        DomainExceptionValidation.When(string.IsNullOrEmpty(nome), "Nome do paciente inválido.");
        DomainExceptionValidation.When(dataNascimento > DateTime.Now, "Data de nascimento inválida.");
        DomainExceptionValidation.When(string.IsNullOrEmpty(sexo), "Sexo do paciente inválido.");
        DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email do paciente inválido.");

        Nome = nome;
        DataNascimento = dataNascimento;
        Sexo = sexo;
        Email = email;
        Telefone = telefone;
    }
}
}
