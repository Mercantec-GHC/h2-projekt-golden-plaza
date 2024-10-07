using System.ComponentModel.DataAnnotations; // Ensure you have the required namespace

//Used to secure that when editing or handling booking, so that only the required information is used.
namespace DomainModels.DTO
{
    public class CreateBookingDTO
    {

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int RoomTypeId { get; set; }
        public string? UserId { get; set; }
    }
}
