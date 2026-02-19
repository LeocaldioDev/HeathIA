# Acesse https://aka.ms/customizecontainer para saber como personalizar seu contêiner de depuração e como o Visual Studio usa este Dockerfile para criar suas imagens para uma depuração mais rápida.

# Esta fase é usada durante a execução no VS no modo rápido (Padrão para a configuração de Depuração)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Esta fase é usada para compilar o projeto de serviço
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["HealthIA.API/HealthIA.API.csproj", "HealthIA.API/"]
COPY ["HealthIA.Infra.Ioc/HealthIA.Infra.Ioc.csproj", "HealthIA.Infra.Ioc/"]
COPY ["HealthIA.Application/HealthIA.Application.csproj", "HealthIA.Application/"]
COPY ["HealthIA.Domain/HealthIA.Domain.csproj", "HealthIA.Domain/"]
COPY ["HealthIA.Infra.Data/HealthIA.Infra.Data.csproj", "HealthIA.Infra.Data/"]
RUN dotnet restore "./HealthIA.API/HealthIA.API.csproj"
COPY . .
WORKDIR "/src/HealthIA.API"
RUN dotnet build "./HealthIA.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Esta fase é usada para publicar o projeto de serviço a ser copiado para a fase final
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./HealthIA.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Esta fase é usada na produção ou quando executada no VS no modo normal (padrão quando não está usando a configuração de Depuração)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthIA.API.dll"]