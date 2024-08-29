using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class User
{ 
    public int UserId { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public string LoginStatus { get; set; }
    public DateTime RegisterDate { get; set; }
}