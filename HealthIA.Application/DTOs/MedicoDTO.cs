using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HealthIA.Application.DTOs
{
    public class MedicoDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="é obrigatorio o Nome")]
        [MaxLength(70, ErrorMessage ="O Nome deve ter no máximo 70 caracteres")]
        public string Nome { get; set; } = string.Empty;
        [Required(ErrorMessage = "é obrigatorio o Email")]
        [EmailAddress(ErrorMessage ="Email inválido")]
        public string Email { get; set; } = string.Empty;
    }
}
