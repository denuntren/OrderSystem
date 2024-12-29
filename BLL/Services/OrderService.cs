using BLL.Interface;
using DAL.Entities;
using DAL.Interface;

namespace BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<Order> _orderRepository;

        public OrderService(IRepository<Order> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            return await _orderRepository.GetByIdAsync(orderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task CreateOrderAsync(Order order)
        {
            // Логіка для створення замовлення
            await _orderRepository.AddAsync(order);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            // Логіка для оновлення замовлення
            await _orderRepository.UpdateAsync(order);
        }

        public async Task DeleteOrderAsync(int orderId)
        {
            // Логіка для видалення замовлення
            await _orderRepository.DeleteAsync(orderId);
        }
    }
}