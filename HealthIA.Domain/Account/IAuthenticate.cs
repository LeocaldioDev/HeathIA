using HealthIA.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Account
{
    public interface IAuthenticate
    {
        public Task<bool> AuthenticateUser(string email, string password);
        public string GenerateToken(int id,string email,UserRole role);
        public Task<bool> UserExists(string email);
        public Task<Usuario> GetUserByEmail(string email);
    }
}
