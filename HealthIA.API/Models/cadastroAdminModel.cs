using HealthIA.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HealthIA.API.Models
{
    
        public class CadastroAdminModel
        {
            [Required(ErrorMessage = "O Nome é obrigatório")]
            [MaxLength(70, ErrorMessage = "O Nome deve ter no máximo 70 caracteres")]
            public string Nome { get; set; }

            [Required(ErrorMessage = "O Email é obrigatório!")]
            [EmailAddress(ErrorMessage = "O Email informado é inválido!")]
            public string Email { get; set; }

            [Required(ErrorMessage = "A senha é obrigatória!")]
            public string Password { get; set; }
        }
    

}
