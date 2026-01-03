using HealthIA.API.Middleware;
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


builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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


app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("FrontendPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
