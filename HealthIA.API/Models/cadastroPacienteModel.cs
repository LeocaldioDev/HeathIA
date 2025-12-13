using HealthIA.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HealthIA.API.Models
{
    public class cadastroPacienteModel
    {
        [Required(ErrorMessage = "O Nome é obrigatório!")]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A Data de Nascimento é obrigatória!")]
        public DateTime DataNascimento { get; set; }

        [Required(ErrorMessage = "O Sexo é obrigatório!")]
        public string Sexo { get; set; }

        public string Telefone { get; set; }

        [Required(ErrorMessage = "O Email é obrigatório!")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória!")]
        public string Password { get; set; }
    }

}
