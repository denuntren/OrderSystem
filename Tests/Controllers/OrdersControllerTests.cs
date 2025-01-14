using BLL.Interface;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OrderSystem.Controllers;
using Xunit;
using Assert = Xunit.Assert;

namespace Tests.Controllers;

public class OrdersControllerTests
{
    private readonly Mock<IOrderService> _mockOrderService;
    private readonly Mock<IProductService> _mockProductService;
    private readonly OrdersController _ordersController;

    public OrdersControllerTests()
    {
        _mockOrderService = new Mock<IOrderService>();
        _mockProductService = new Mock<IProductService>();
        _ordersController = new OrdersController(_mockOrderService.Object, _mockProductService.Object);
    }

    [Fact]
    public async Task GetOrder_ShouldReturnNotFound_WhenOrderDoesNotExist()
    {
        int orderId = 99;
        _mockOrderService.Setup(s => s.GetOrderByIdAsync(orderId))
            .ReturnsAsync((Order)null);

        var result = await _ordersController.GetOrder(orderId);
        Assert.IsType<NotFoundResult>(result);
    }
    
    [Fact]
    public async Task GetOrder_ShouldReturnOk_WhenOrderExist()
    {
        int orderId = 1;
        var fakeOrder = new Order
        {
            Id = orderId,
            UserId = 123,
            TotalAmount = 50.00m
        };

        _mockOrderService.Setup(s => s.GetOrderByIdAsync(orderId))
            .ReturnsAsync(fakeOrder);

        var result = await _ordersController.GetOrder(orderId);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedOrder = Assert.IsType<Order>(okResult.Value);
        Assert.Equal(orderId, returnedOrder.Id);
        Assert.Equal(50.00m, returnedOrder.TotalAmount);
    }
    
}