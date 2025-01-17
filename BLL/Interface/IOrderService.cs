﻿using DAL.Entities;

namespace BLL.Interface;

public interface IOrderService
{
    Task<Order> GetOrderByIdAsync(int orderId);
    Task<IEnumerable<Order>> GetOrdersAsync();
    Task CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
    Task<IEnumerable<Order>> GetOrderByUserIdAsync(int userId);
    Task DeleteOrderAsync(int orderId);
}