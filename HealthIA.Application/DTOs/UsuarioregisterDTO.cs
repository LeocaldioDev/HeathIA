using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace HealthIA.Application.DTOs
{
    public class UsuarioregisterDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "O Email é obrigatório!")]
        [EmailAddress(ErrorMessage ="O Email informado é inválido!")]
        public string Email { get; set; }

        [JsonIgnore]
        public UserRole Role { get; set; }
        public string password { get; set; }
        

    }
}
