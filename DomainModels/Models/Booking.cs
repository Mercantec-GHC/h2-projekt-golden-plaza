using System.Text.Json.Serialization;

namespace DomainModels.Models.Entities;

//Class to handle booking
public class Booking
{

    public int Id { get; set; }

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }

    public decimal Price { get; set; }
    public bool IsReserved { get; set; }

    //public Customer Customer { get; set; }

    //Inserted JsonIgnore, to avoid errors in post requests for rooms and bookings.
    [JsonIgnore]
    public Room? Room { get; set; } // Navigation property to Room

    // Foreign key to Room
    public int RoomId { get; set; }

    // Foreign key to Customer
   // public string UserId { get; set; }
}

// Foreign Key = Database relationship 
// Navigation property = Object reference for accessing related data in code