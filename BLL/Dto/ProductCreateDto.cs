using System.ComponentModel.DataAnnotations;

namespace BLL.Dto;

public class ProductCreateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(55, ErrorMessage = "Name cannot exceed 55 characters.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
    public string Description { get; set; }

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "StockQuantity is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "StockQuantity cannot be negative.")]
    public int StockQuantity { get; set; }
}