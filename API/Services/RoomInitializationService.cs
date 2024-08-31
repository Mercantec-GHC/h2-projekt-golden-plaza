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
           // Check if there are any rooms in the database
           if (!_context.Rooms.Any())
           {
               var rooms = new List<Room>
               {
                   new Room
                   {
                       Capacity = 2,
                       RoomType = "Single",
                       RoomNumber = 101,
                       PricePerNight = 100m,
                       Facilities = new List<string> { "WiFi", "TV" }
                   },
                   new Room
                   {
                       Capacity = 4,
                       RoomType = "Double",
                       RoomNumber = 102,
                       PricePerNight = 150m,
                       Facilities = new List<string> { "WiFi", "TV", "Mini Bar" }
                   }
               };


               // Save rooms to the database first to generate IDs
               _context.Rooms.AddRange(rooms);
               _context.SaveChanges();


               // Now that rooms have been saved, generate bookings for each room
               foreach (var room in rooms)
               {
                   room.Availabilities = GenerateRoomAvailability(room.PricePerNight, room);
               }


               // Add bookings to the context
               foreach (var room in rooms)
               {
                   _context.Bookings.AddRange(room.Availabilities);
               }


               _context.SaveChanges();
           }
       }


       private List<Booking> GenerateRoomAvailability(decimal basePrice, Room room)
       {
           var availabilities = new List<Booking>();
           DateTime startDate = new DateTime(DateTime.Now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);  // Set to UTC
           DateTime endDate = new DateTime(DateTime.Now.Year, 12, 31, 23, 59, 59, DateTimeKind.Utc);  // Set to UTC


           for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
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


           return availabilities;
       }
   }
   
}