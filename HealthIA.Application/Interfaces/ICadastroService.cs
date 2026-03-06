using HealthIA.Application.DTOs;

namespace HealthIA.Application.Interfaces
{
    public interface ICadastroService
    {
        Task<RegistroResult> RegistrarPacienteAsync(CadastroPacienteDTO model);
        Task<RegistroResult> RegistrarAdminAsync(CadastroAdminDTO model);
        Task<RegistroResult> RegistrarMedicoAsync(CadastroMedicoDTO model);
    }
}
