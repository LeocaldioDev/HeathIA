using HealthIA.Application.Mapping;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using HealthIA.Infra.Data.Context;
using System;
using System.Collections.Generic;
using System.Text;
using HealthIA.Infra.Data.Repository;
using HealthIA.Domain.Interface;
using HealthIA.Application.Interfaces;
using HealthIA.Application.Services;

namespace HealthIA.Infra.Ioc
{
    public static class InjeccaoDeDependencias
    {
       public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<AppDataBase>(c => c.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b=>b.MigrationsAssembly(typeof(AppDataBase).Assembly.FullName)));



            services.AddAutoMapper(cfg => cfg.AddProfile<Mapeador>());



            //injecção de dependecias Repository

            services.AddScoped<IConsultaRepository, ConsultaRepository>();
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IMedicoRepository, MedicoRepository>();


            //injecção de dependecias service

            services.AddScoped<IConsultaService, ConsultaService>();
            services.AddScoped<IPacienteService, PacienteService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IMedicoService, MedicoService>();




           

            return services;

        }

    }
}
