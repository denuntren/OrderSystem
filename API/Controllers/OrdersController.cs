using BLL.Dto;
using BLL.Interface;
using DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace OrderSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        public OrdersController(IOrderService orderService, IProductService productService)
        {
            _orderService = orderService;
            _productService = productService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOrdersAsync()
        {
            try
            {
                var orders = await _orderService.GetOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error while getting orders.", Details = ex.Message});
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderCreateDto)
        {
            if (orderCreateDto == null)
                return BadRequest("Invalid order data.");

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in orderCreateDto.Items)
            {
                // Використання нового методу для отримання повної сутності Product
                var product = await _productService.GetProductEntityByIdAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Product with ID {item.ProductId} not found.");

                if (product.StockQuantity < item.Quantity)
                    return BadRequest($"Not enough stock for product ID {item.ProductId}.");

                // Оновлення кількості товару
                product.StockQuantity -= item.Quantity;
                await _productService.UpdateProductAsync(product.Id, new ProductUpdateDto
                {
                    StockQuantity = product.StockQuantity
                });

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Price = product.Price
                };

                totalAmount += orderItem.Quantity * orderItem.Price;
                orderItems.Add(orderItem);
            }

            var order = new Order
            {
                UserId = orderCreateDto.UserId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                OrderItems = orderItems
            };

            await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrdersAsync()
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
                if (userIdClaim == null)
                    return Unauthorized();
                
                var userId = int.Parse(userIdClaim.Value);
                var orders = await _orderService.GetOrderByUserIdAsync(userId);
                
                if (!orders.Any())
                {
                    return NotFound("Not orders found.");
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error while getting orders.", Details = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (order == null || order.Id != id)
                return BadRequest("Invalid order data.");

            await _orderService.UpdateOrderAsync(order);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            await _orderService.DeleteOrderAsync(id);
            return NoContent();
        }
    }
}
