using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Application.IGemini
{
    public interface IGeminiService
    {
      
    Task<string?> GerarDiagnosticoAsync(string sintomas);
    

}
}
