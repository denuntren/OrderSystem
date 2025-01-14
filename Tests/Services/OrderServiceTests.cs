using Xunit;
using Moq;
using DAL.Entities;
using BLL.Interface;
using BLL.Services;
using DAL.Interface;
using Assert = Xunit.Assert;

namespace Tests.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _mockOrderRepo;
        private readonly IOrderService _orderService;

        public OrderServiceTests()
        {
            _mockOrderRepo = new Mock<IOrderRepository>();
            _orderService = new OrderService(_mockOrderRepo.Object);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldCallAddAsync()
        {
            var order = new Order
            {
                Id = 0,
                UserId = 1,
                TotalAmount = 99.99m
            };

            await _orderService.CreateOrderAsync(order);

            _mockOrderRepo.Verify(r => r.AddAsync(It.Is<Order>(o => o.UserId == 1)), Times.Once);
        }

        [Fact]
        public async Task GetOrdersAsync_ShouldReturnListOfOrders()
        {
            var fakeOrders = new List<Order>
            {
                new Order { Id = 1, UserId = 2, TotalAmount = 50m },
                new Order { Id = 2, UserId = 3, TotalAmount = 75m }
            };
            _mockOrderRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(fakeOrders);

            var orders = await _orderService.GetOrdersAsync();

            Assert.NotNull(orders);
            Assert.Equal(2, ((List<Order>)orders).Count);
            Assert.Contains(orders, o => o.Id == 1);
            Assert.Contains(orders, o => o.Id == 2);
        }
    }
}