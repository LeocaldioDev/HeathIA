using HealthIA.Domain.Entities;

namespace HealthIA.API.Models
{
    public class UserToken
    {
        public string Token { get; set; }
        public UserRole Role { get; set; }
        public string email { get; set; }
    }
}
