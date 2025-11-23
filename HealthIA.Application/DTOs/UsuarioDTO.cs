using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HealthIA.Application.DTOs
{
    public class UsuarioDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="O Nome é obrigatório!")]
        [MaxLength(100,ErrorMessage ="O Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O Email é obrigatório!")]
        [EmailAddress(ErrorMessage ="O Email informado é inválido!")]
        public string Email { get; set; }
        [NotMapped]
        public string password { get; set; }

        public bool IsAdmin { get; set; }
    }
}
