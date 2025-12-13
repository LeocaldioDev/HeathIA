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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using HealthIA.Domain.Account;
using HealthIA.Infra.Data.Identity;

namespace HealthIA.Infra.Ioc
{
    public static class InjeccaoDeDependencias
    {
       public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {


            services.AddDbContext<AppDataBase>(c => c.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(AppDataBase).Assembly.FullName)));




            services.AddAuthentication(opt =>
            { 
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }

            ).AddJwtBearer(
                options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:secretKey"])),
                    ClockSkew = TimeSpan.Zero
                };
                options.RequireHttpsMetadata = false;
            });







            services.AddAutoMapper(cfg => cfg.AddProfile<Mapeador>());



            //injecção de dependecias Repository

            services.AddScoped<IConsultaRepository, ConsultaRepository>();
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IMedicoRepository, MedicoRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();


            //injecção de dependecias service

            services.AddScoped<IConsultaService, ConsultaService>();
            services.AddScoped<IPacienteService, PacienteService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IMedicoService, MedicoService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IAuthenticate, AuthenticateServices>();




           

            return services;

        }

    }
}
