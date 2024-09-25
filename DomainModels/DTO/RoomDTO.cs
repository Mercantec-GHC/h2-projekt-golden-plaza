using DomainModels.Models.Entities;

namespace API.DTO
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public int Capacity { get; set; }
        public RoomType? RoomType { get; set; }
        public required int RoomNumber { get; set; }
        public decimal PricePerNight { get; set; }
        public List<string>? Facilities { get; set; }
    }
}
