using System.ComponentModel.DataAnnotations; // Ensure you have the required namespace

//Used to secure that when editing or handling booking, so that only the required information is used.
namespace DomainModels.DTO
{
    public class BookingDTO
    {
        public int Id { get; set; }

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }

        public decimal Price { get; set; }

        public bool IsReserved { get; set; }

        public int RoomId { get; set; }    // Foreign key to Room

        public string? UserId { get; set; }   // Foreign key to Customer
    }
}
