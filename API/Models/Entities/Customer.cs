using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class Customer : User
{
    public string UserName { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public string Address { get; set; }
    
    // Navigation property to Booking
    public List<Booking> Bookings { get; set; }
}