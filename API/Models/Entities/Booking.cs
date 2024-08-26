using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Entities;

public class Booking
{
    [Key]
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public decimal Price { get; set; }
    public bool IsReserved { get; set; }

    // Foreign key to Room
    public int RoomId { get; set; }

    [JsonIgnore] 
    public Room Room { get; set; }

    // Foreign key to Customer
    public int? CustomerId { get; set; }  // Make CustomerId nullable

    [JsonIgnore] 
    public Customer Customer { get; set; }
}