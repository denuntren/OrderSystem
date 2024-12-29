using System.ComponentModel.DataAnnotations;

namespace BLL.Dto;

public class ProductUpdateDto
{
    [MaxLength(55, ErrorMessage = "Name cannot exceed 55 characters.")]
    public string? Name { get; set; }

    [MaxLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal? Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "StockQuantity cannot be negative.")]
    public int? StockQuantity { get; set; }
}