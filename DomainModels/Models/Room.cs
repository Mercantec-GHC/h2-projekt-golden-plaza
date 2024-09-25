using System.Text.Json.Serialization;

namespace DomainModels.Models.Entities
{
    public class Room
    { 
        public int Id { get; set; }
        public int Capacity { get; set; }
        public RoomType RoomType { get; set; }
        public required int RoomNumber { get; set; }
        public decimal PricePerNight { get; set; }
        public List<string>? Facilities { get; set; }
        // Navigation property to Booking

        [JsonIgnore]
        public List<Booking>? Availabilities { get; set; } 
    }
}