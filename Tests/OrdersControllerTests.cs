using Moq;
using OrderSystem.Api.Controllers;
using BLL.Interface;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using System.Threading.Tasks;
using OrderSystem.Controllers;
using Assert = Xunit.Assert;

public class OrdersControllerTests
{
    private readonly Mock<IOrderService> _mockOrderService;
    private readonly Mock<IProductService> _mockProductService;
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _mockOrderService = new Mock<IOrderService>();
        _mockProductService = new Mock<IProductService>();
        _controller = new OrdersController(_mockOrderService.Object, _mockProductService.Object);
    }

    [Fact]
    public async Task GetOrder_ReturnsOkResult_WhenOrderExists()
    {
        // Arrange
        var order = new Order { Id = 1, UserId = 4, TotalAmount = 100.00m };
        _mockOrderService.Setup(service => service.GetOrderByIdAsync(1)).ReturnsAsync(order);

        // Act
        var result = await _controller.GetOrder(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<Order>(okResult.Value);
        Assert.Equal(order.Id, returnValue.Id);
    }

    [Fact]
    public async Task GetOrder_ReturnsNotFound_WhenOrderDoesNotExist()
    {
        // Arrange
        _mockOrderService.Setup(service => service.GetOrderByIdAsync(It.IsAny<int>())).ReturnsAsync((Order)null);

        // Act
        var result = await _controller.GetOrder(1);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}