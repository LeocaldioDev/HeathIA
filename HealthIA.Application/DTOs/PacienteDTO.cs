using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace HealthIA.Application.DTOs
{
    public class PacienteDTO
    {
        [Key]
        public int Id { get;  set; }
        [Required(ErrorMessage = "O Nome é obrigatório!")]
        [MaxLength(100, ErrorMessage = "O Nome deve ter no máximo 100 caracteres")]
        public string Nome { get;  set; }
        [Required(ErrorMessage = "A Data de Nascimento é obrigatória!")]
        public DateTime DataNascimento { get;  set; }
        [Required(ErrorMessage = "O Sexo é obrigatório!")]
        public string Sexo { get;  set; }
        public string Telefone { get; set; }

        [Required]
        public int UsuarioId { get;  set; }

    }
}
