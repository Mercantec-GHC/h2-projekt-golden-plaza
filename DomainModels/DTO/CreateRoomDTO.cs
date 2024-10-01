namespace DomainModels.DTO
{
    public class CreateRoomDTO
    {
        public int Id { get; set; }
        public int Capacity { get; set; }
        public int RoomTypeId { get; set; }
        public required int RoomNumber { get; set; }
        public decimal PricePerNight { get; set; }
        public List<string>? Facilities { get; set; }
    }
}
