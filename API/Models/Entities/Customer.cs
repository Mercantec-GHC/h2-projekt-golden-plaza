using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class Customer : User
{
    public string UserName { get; set; }
    public string Address { get; set; }
    public string Email { get; set; }
    
    //Foreign Key to Booking
    public List<Booking> Bookings { get; set; }
}