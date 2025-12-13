using HealthIA.Application.GeminiService;
using HealthIA.Application.IGemini;
using HealthIA.Infra.Ioc;

var builder = WebApplication.CreateBuilder(args);

var geminiApiKey = builder.Configuration["Gemini:ApiKey"];

if (string.IsNullOrWhiteSpace(geminiApiKey))
{
    throw new InvalidOperationException("Gemini ApiKey não configurada.");
}

Environment.SetEnvironmentVariable("GOOGLE_API_KEY", geminiApiKey);

builder.Services.AddSingleton<Google.GenAI.Client>();

builder.Services.AddScoped<IGeminiService, GeminiService>();


builder.Services.AddControllers();

builder.Services.AddInfrastructureSwagger();


builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthIA API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
