using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Entities;

public class RoomAvailability
{
    [Key]
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public decimal Price { get; set; }
    public bool IsReserved { get; set; }

    // Foreign key to Room
    public int RoomId { get; set; }

    [JsonIgnore] // Ignore to break the cycle
    public Room Room { get; set; }
}