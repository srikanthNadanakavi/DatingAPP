using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _contex;
        public AuthRepository(DataContext contex) {
            _contex = contex;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _contex.users.Include(x=>x.Photos).FirstOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                return null;

            if (!varifyPasswordHash(password, user.PasswordSalt, user.PasswordHash))
                return null;
          
             return user;
        }

        private bool varifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));


                for (int i = 0; i < computedHash.Length; i++)
                {               
                     if(passwordHash[i] != computedHash[i])
                     return false;
                }
            }
         return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;

            await _contex.users.AddAsync(user);
            await _contex.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {

                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }

        public async Task<bool> UserExist(string username){

            if( await _contex.users.AnyAsync(x=>x.UserName == username))
            return true;

            return false;
        }
    }
}