using HealthIA.API.Errors;
using HealthIA.Domain.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace HealthIA.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                await HandleExceptionAsync(
                    context,
                    HttpStatusCode.Unauthorized,
                    ex,
                    "Acesso não autorizado");
            }
            catch (ArgumentException ex)
            {
                await HandleExceptionAsync(
                    context,
                    HttpStatusCode.BadRequest,
                    ex,
                    ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                await HandleExceptionAsync(
                    context,
                    HttpStatusCode.NotFound,
                    ex,
                    "Recurso não encontrado");
            }
            catch (DomainExceptionValidation ex)
            {
                await HandleExceptionAsync(
                    context,
                    HttpStatusCode.BadRequest,
                    ex,
                    ex.Message);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(
                    context,
                    HttpStatusCode.InternalServerError,
                    ex,
                    "Erro interno do servidor");
            }
        }

        private async Task HandleExceptionAsync(
            HttpContext context,
            HttpStatusCode statusCode,
            Exception exception,
            string message)
        {
            _logger.LogError(exception, exception.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = _env.IsDevelopment()
                ? new ApiException(
                    context.Response.StatusCode.ToString(),
                    exception.Message,
                    exception.StackTrace)
                : new ApiException(
                    context.Response.StatusCode.ToString(),
                    message);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
        }
    }
}
