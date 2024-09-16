using API.Data;
using API.Models.Entities;

//NOT IN USE. WAS USED TO CREATE DUMMY DATA

/*
    To use RoomInitializationService:

    1. Register in Program.cs:
       builder.Services.AddTransient<RoomInitializationService>();

    2. Seed data on startup:
       using (var scope = app.Services.CreateScope())
       {
           var initializer = scope.ServiceProvider.GetRequiredService<RoomInitializationService>();
           initializer.InitializeRooms();
       }
*/

namespace API.Services
{
    
   public class RoomInitializationService
   {
       private readonly ApplicationDBContext _context;


       public RoomInitializationService(ApplicationDBContext context)
       {
           _context = context;
       }


       public void InitializeRooms()
       {
           
           if (!_context.Rooms.Any()) // If no rooms exist in db, create some
           {
                var rooms = new List<Room>
{
                    new Room
                    {
                        Capacity = 2,
                        RoomType = new RoomType
                    {
                        RoomTypeName = "Deluxe",
                        Tags = new List<string> { "Spacious", "Sea View" }
                    },
                        RoomNumber = 101,
                        PricePerNight = 100m,
                        Facilities = new List<string> { "WiFi", "TV" }
                    },
                new Room
                    {
                        Capacity = 4,
                        RoomType = new RoomType
                    {
                        RoomTypeName = "Standard",
                        Tags = new List<string> { "Cozy", "Mountain View" }
                    },
                        RoomNumber = 102,
                        PricePerNight = 150m,
                        Facilities = new List<string> { "WiFi", "TV", "Mini Bar" }
                    }
           };


                // Save rooms to the database first to generate IDs
                _context.Rooms.AddRange(rooms);
               _context.SaveChanges();


               // Now that rooms have been saved, loop through rooms and generate bookings for each room
               foreach (var room in rooms)
               {
                   // Calls GenerateRoomAvailability method to create a list of booking objects
                    room.Availabilities = GenerateRoomAvailability(room.PricePerNight, room); //Assigns the generated bookings to the Availabilities property of each room
               }


               // Add bookings to the Dbcontext (bridge between the in-memory objects and the database)
               foreach (var room in rooms) 
               {
                   _context.Bookings.AddRange(room.Availabilities); // Add all bookings for the room
               }


               _context.SaveChanges();
           }
       }


       private List<Booking> GenerateRoomAvailability(decimal basePrice, Room room) // Generate bookings for a room
       {
           var availabilities = new List<Booking>(); // List to store bookings
           DateTime startDate = new DateTime(DateTime.Now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);  // Set to UTC
           DateTime endDate = new DateTime(DateTime.Now.Year, 12, 31, 23, 59, 59, DateTimeKind.Utc);  // Set to UTC


           for (DateTime date = startDate; date <= endDate; date = date.AddDays(1)) // Loop through each day of the year
           {
               decimal price = basePrice; 


               // Adjust price for weekends etc.
               if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
               {
                   price *= 1.2m;
               }


               availabilities.Add(new Booking 
               {
                   Date = date,
                   Price = price,
                   IsReserved = false,
                   RoomId = room.Id 
               });
           }


           return availabilities; // Return all generated bookings
       }
   }
   
}