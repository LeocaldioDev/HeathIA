using System.ComponentModel.DataAnnotations;

namespace HealthIA.API.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "O email é obrigatorio")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatoria")]
        [DataType(DataType.Password)]
        public string Senha { get; set; }
    }
}
