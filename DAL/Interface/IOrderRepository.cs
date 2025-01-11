using DAL.Entities;

namespace DAL.Interface;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetOrdersByUserIdWithDetailsAsync(int userId);
}