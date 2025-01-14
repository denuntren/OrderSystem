using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using BLL.Interface;
using BLL.Dto;
using DAL.Entities;
using OrderSystem.Api.Controllers;
using Assert = Xunit.Assert;

namespace Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Register_ShouldReturnOk_WhenUserIsCreated()
        {
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);

            var dto = new UserRegisterDto
            {
                Username = "John",
                Email = "john@example.com",
                Password = "Test1234"
            };

            mockAuthService.Setup(s => s.RegisterAsync(dto.Username, dto.Email, dto.Password))
                .ReturnsAsync(new User
                {
                    Id = 1,
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = "hashedPassword",
                    Role = "User"
                });

            mockAuthService.Setup(s => s.GenerateToken(It.IsAny<User>())).Returns("fake-jwt-token");

            var result = await controller.Register(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Success!", okResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenExceptionThrown()
        {
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);

            var dto = new UserRegisterDto
            {
                Username = "John",
                Email = "john@example.com",
                Password = "Test1234"
            };

            mockAuthService.Setup(s => s.RegisterAsync(dto.Username, dto.Email, dto.Password))
                .ThrowsAsync(new System.Exception("Email already in use"));

            var result = await controller.Register(dto);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Email already in use", badRequestResult.Value.ToString());
        }
    }
}
