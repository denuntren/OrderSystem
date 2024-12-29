using System.ComponentModel.DataAnnotations;

namespace BLL.Dto;

public class OrderCreateDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public List<OrderItemDto> Items { get; set; }
}