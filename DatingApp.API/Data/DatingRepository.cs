using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private DataContext _Context { get; set; }
        private IMapper _mapper { get; set; }
        public DatingRepository(DataContext context)
        {

            this._Context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            this._Context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this._Context.Remove(entity);
        }

        public async Task<User> Getuser(int id)
        {
            var user = await this._Context.users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == id);

           return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await this._Context.users.Include(p => p.Photos).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _Context.SaveChangesAsync() > 0;
        }


    }
}