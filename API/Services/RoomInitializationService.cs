using API.Data;
using API.Models.Entities;

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

            // Initialize customers
            InitializeCustomers();
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
                    RoomId = room.Id  // Ensure the RoomId is correctly set
                });
            }

            return availabilities;
        }

        private void InitializeCustomers()
        {
            // Check if there are any customers in the database
            if (!_context.Customers.Any())
            {
                var customers = new List<Customer>
                {
                    new Customer
                    {
                        UserName = "Steve Peak",
                        Address = "123 Main St",
                        Email = "Steve@example.com",
                        LoginStatus = "Active",
                        RegisterDate = DateTime.UtcNow,
                        UserPassword = "test123"
                    },
                    new Customer
                    {
                        UserName = "Erik Sean",
                        Address = "456 Elm St",
                        Email = "Erik@example.com",
                        LoginStatus = "Active",
                        RegisterDate = DateTime.UtcNow,
                        UserPassword = "test456"
                    }
                };

                _context.Customers.AddRange(customers);
                _context.SaveChanges();
            }
        }
    }
}
