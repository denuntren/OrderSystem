using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using DAL;
using BLL.Services;
using Assert = Xunit.Assert;

namespace Tests.Services
{
    public class AuthServiceTests
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _dbContext;

        public AuthServiceTests()
        {
            var dbOptions = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"TestDb_{Guid.NewGuid()}")
                .Options;
            _dbContext = new AppDbContext(dbOptions);

            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(c => c["Jwt:Key"]).Returns("TestSecretKey1234");
            mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");

            _authService = new AuthService(_dbContext, mockConfig.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldRegisterNewUser()
        {
            // Arrange
            string username = "TestUser";
            string email = "testuser@example.com";
            string password = "Test123";

            var user = await _authService.RegisterAsync(username, email, password);

            Assert.NotNull(user);
            Assert.Equal(email, user.Email);

            var userInDb = _dbContext.Users.FirstOrDefault(u => u.Email == email);
            Assert.NotNull(userInDb);
            Assert.True(BCrypt.Net.BCrypt.Verify(password, userInDb.PasswordHash));
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowException_WhenInvalidCredentials()
        {
            string email = "nonexist@example.com";
            string password = "SomePass";

            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(email, password));
        }
    }
}
