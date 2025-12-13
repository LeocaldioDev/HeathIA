using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace HealthIA.Application.DTOs
{
    public class MedicoDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="é obrigatorio o Nome")]
        [MaxLength(70, ErrorMessage ="O Nome deve ter no máximo 70 caracteres")]
        public string Nome { get; set; } = string.Empty;
        [Required]
        public int UsuarioId { get; set; }
    }
}
