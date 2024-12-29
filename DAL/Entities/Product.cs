using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DAL.Entities;

public class Product
{ 
        [Key]
        public int Id { get; set; }

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
        [JsonIgnore]
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}