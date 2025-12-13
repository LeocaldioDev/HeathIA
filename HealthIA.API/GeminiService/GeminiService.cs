using HealthIA.Application.IGemini;
using System;
using System.Collections.Generic;
using System.Text;
using Google.GenAI;

namespace HealthIA.Application.GeminiService
{
    public class GeminiService : IGeminiService
    {
        private readonly Client _client;
        private readonly IConfiguration _configuration;

        public GeminiService(Client client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<string?> GerarDiagnosticoAsync(string sintomas)
        {
            if (string.IsNullOrWhiteSpace(sintomas))
                return null;


            var model = _configuration["Gemini:Model"];

            var prompt = $"""
        O texto abaixo contém sintomas escritos por um paciente, possivelmente com erros ortográficos.

        1. Corrija os erros ortográficos
        2. Organize os sintomas de forma clínica
        3. Forneça um diagnóstico médico básico (não definitivo)
        4. Sugira orientações gerais e seguras

        Sintomas:
        {sintomas}

        Importante:
        - Não substitua um médico
        - Não forneça medicação controlada
        - Seja claro e objetivo
        -e seja curto e objectivo, nada de muito texto
        """;

            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: model,
                    contents: prompt
                );

                return response?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;
            }
            catch (ClientError ex)
            {
                // Log do erro real
                Console.Error.WriteLine(ex);
                return null;
            }
        }
    }

}
