using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace HealthIA.Application.DTOs
{
    public class ConsultaPostDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Os Sintomas são obrigatorios")]
        [MaxLength(1000, ErrorMessage = "Os Sintomas devem ter no maximo 1000 caracteres")]
        public string Sintomas { get; set; }
        [Required(ErrorMessage = "O Diagnóstico é obrigatório")]
        [MaxLength(2000, ErrorMessage = "O Diagnóstico deve ter no máximo 1000 caracteres")]
        public string DiagnosticoIA { get; set; }
        public DateTime DataConsulta { get; set; }
        public int PacienteId { get; set; }

        public bool Validacaomedica { get;  set; }
    }
}
