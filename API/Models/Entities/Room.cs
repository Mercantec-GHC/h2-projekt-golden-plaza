using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Entities;

public class Room
{
    [Key]
    public int Id { get; set; }

    public int Capacity { get; set; }

    public string RoomType { get; set; }

       
    public required int RoomNumber { get; set; }

    public decimal PricePerNight { get; set; }

    [JsonIgnore] // Ignore to break the cycle
    public List<RoomAvailability> Availabilities { get; set; }

    // Facilities as a list of strings
    public List<string> Facilities { get; set; }
}