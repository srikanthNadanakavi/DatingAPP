using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T:class;
        Task<bool> SaveAll();
        Task<User> Getuser(int id);
        Task<IEnumerable<User>> GetUsers();
        Task<Photo> GetPhoto(int id);

        Task<Photo> GetMainPhtotoForUser(int Userid);


    }
}