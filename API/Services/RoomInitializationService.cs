using API.Data;
using API.Models.Entities;

namespace API.Services;

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
            if (_context.Rooms.Any())
            {
                // Rooms already exist, skip initialization
                return;
            }

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

            foreach (var room in rooms)
            {
                room.Availabilities = GenerateRoomAvailability(room.PricePerNight, room);
            }

            _context.Rooms.AddRange(rooms);
            _context.SaveChanges();
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