using HealthIA.Application.DTOs;
using HealthIA.Domain.Account;
using HealthIA.Domain.Entities;
using HealthIA.Infra.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HealthIA.Infra.Data.Identity
{
    public class AuthenticateServices : IAuthenticate
    {
        private readonly AppDataBase _context;
        private readonly IConfiguration _configuration;
        public AuthenticateServices(AppDataBase context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<bool> AuthenticateUser(string email, string password)
        {
            var usuario = await _context.Usuarios.Where(x => x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();

            if (usuario == null)
                return false;
            using var hmac = new HMACSHA256(usuario.SenhaSalt);
            var computerHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return computerHash.SequenceEqual(usuario.SenhaHash);
        }



        public string GenerateToken(int id, string email,UserRole role)
        {
            var Claims = new[]
            {
               new Claim(ClaimTypes.NameIdentifier, id.ToString()),
               new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role.ToString()),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
             };

            var privateKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:secretKey"]));
            var credentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256);


            var expiration = DateTime.Now.AddMinutes(50);


            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: Claims,
                expires: expiration,
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<Usuario> GetUserByEmail(string email)
        {
            return await _context.Usuarios.Where(x => x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
        }

        public async Task<bool> UserExists(string email)
        {
           var usuario = await _context.Usuarios.Where(x => x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
            if (usuario == null)
                return false;
            return true;
        }
    }
}
