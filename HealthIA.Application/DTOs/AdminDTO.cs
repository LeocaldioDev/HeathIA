using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace HealthIA.Application.DTOs
{
    public class AdminDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="O Nome é obrigatorio")]
        [MaxLength(70, ErrorMessage ="O Nome deve ter no máximo 70 caracteres")]
        public string Nome { get; set; }

        [Required]
        public int UsuarioId { get; set; }
    }
}
