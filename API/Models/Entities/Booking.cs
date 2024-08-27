namespace API.Models.Entities;

public class Booking
{
   
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public decimal Price { get; set; }
    public bool IsReserved { get; set; }
    
    public Customer Customer { get; set; }
    
    public Room Room { get; set; } // Navigation property to Room

    // Foreign key to Room
    public int RoomId { get; set; }

    // Foreign key to Customer
    public int? CustomerId { get; set; }
}

// Foreign Key = Database relationship
// Navigation property = Object reference for accessing related data in code