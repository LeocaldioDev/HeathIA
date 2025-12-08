using AutoMapper;
using HealthIA.Application.DTOs;
using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.Mapping
{
    public class Mapeador : Profile
    {
        public Mapeador()
        {
           CreateMap<Paciente, PacienteDTO>().ReverseMap();
           CreateMap<Paciente, PacientePostDTO>().ReverseMap();
              CreateMap<Consulta, ConsultaDTO>().ReverseMap();
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<Medico, MedicoDTO>().ReverseMap();
        }
    }
}
