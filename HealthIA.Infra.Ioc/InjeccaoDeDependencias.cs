using HealthIA.Application.Mapping;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Ioc
{
    public static class InjeccaoDeDependencias
    {
       public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddAutoMapper(cfg => cfg.AddProfile<Mapeador>());
            return services;
        }

    }
}
