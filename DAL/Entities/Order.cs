using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DAL.Entities;

public class Order
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public int UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}


