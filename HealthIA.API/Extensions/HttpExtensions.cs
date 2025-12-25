using HealthIA.API.Models;
using System.Text.Json;

namespace HealthIA.API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
        {
            var JsonOptins = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(header, JsonOptins));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
