using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HealthIA.Application.DTOs
{
    public class AdminDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="O Nome é obrigatorio")]
        [MaxLength(70, ErrorMessage ="O Nome deve ter no máximo 70 caracteres")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O email é obrigatorio")]
        [EmailAddress(ErrorMessage = "Email inválido")]

        public string Email { get; set; }
    }
}
