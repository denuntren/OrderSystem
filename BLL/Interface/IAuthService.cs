using DAL.Entities;

namespace BLL.Interface;

public interface IAuthService
{
    public Task<User> RegisterAsync(string username, string email, string password);
    public Task<User> LoginAsync(string email, string password);
    public string GenerateToken(User user);
}