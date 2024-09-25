using System.ComponentModel.DataAnnotations; // Ensure you have the required namespace

namespace DomainModels.DTO
{
    public class BookingDTO
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Price { get; set; }

        public bool IsReserved { get; set; }

        public int RoomId { get; set; }    // Foreign key to Room

        public int? UserId { get; set; }   // Foreign key to Customer
    }
}
