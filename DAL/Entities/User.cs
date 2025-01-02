using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DAL.Entities;

public class User
{
    [Key] 
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; }

    [Required] 
    [EmailAddress] 
    [MaxLength(100)] 
    public string Email { get; set; }

    [Required] 
    public string PasswordHash { get; set; }

    [JsonIgnore] public ICollection<Order> Orders { get; set; } = new List<Order>();

    public string Role { get; set; } = "User";
}