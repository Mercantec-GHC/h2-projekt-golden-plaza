using API.Data;
using DomainModels.DTO;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /// <summary>
    /// Controller for handling booking-related operations.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        /// <summary>
        /// Dependency-injected database context.
        /// </summary>
        private readonly ApplicationDBContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="BookingController"/> class.
        /// </summary>
        /// <param name="context">The database context to be injected.</param>
        public BookingController(ApplicationDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all bookings from the database.
        /// </summary>
        /// <returns>A list of bookings.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            var bookings = await _context.Bookings.Include(b => b.Room).ToListAsync();

            bookings.ForEach(b =>
            {
                b.Room.RoomType = _context.Rooms.Find(b.Room.Id).RoomType;
            });

            return bookings;
        }

        /// <summary>
        /// Retrieves a specific booking by its ID.
        /// </summary>
        /// <param name="id">The ID of the booking to retrieve.</param>
        /// <returns>The requested booking if found, or a 404 error if not.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.Include(b => b.Room).FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        /// <summary>
        /// Creates a new booking in the database.
        /// </summary>
        /// <param name="booking">The booking object to create.</param>
        /// <returns>The created booking along with its URL location.</returns>
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(CreateBookingDTO bookingdto)
        {
            // Find the first available room of the specified type for the booking dates.
            var room = FirstAvailableRoom(bookingdto.CheckIn, bookingdto.CheckOut, bookingdto.RoomTypeId);

            // Return a 400 Bad Request if no available rooms are found.
            if (room == null)
            {
                return BadRequest("No available rooms of the specified type.");
            }

            // Calculate the price based on the room price per night and booking dates.
            decimal price = (bookingdto.CheckOut - bookingdto.CheckIn).Days * room.PricePerNight;

            // Create a new booking object based on the DTO.
            Booking booking = new Booking
            {
                CheckIn = bookingdto.CheckIn,
                CheckOut = bookingdto.CheckOut,
                Price = price,
                IsReserved = false,
                Room = room,
                UserId = bookingdto.UserId
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Return a 201 response with the created booking and its URL location.
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        /// <summary>
        /// Updates an existing booking by its ID.
        /// </summary>
        /// <param name="id">The ID of the booking to update.</param>
        /// <param name="bookingDTO">The updated booking data transfer object.</param>
        /// <returns>An action result indicating the outcome of the operation.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, BookingDTO bookingDTO)
        {
            // Ensure the ID in the URL matches the booking DTO.
            if (id != bookingDTO.Id)
            {
                return BadRequest("ID mismatch.");
            }

            // Check if the updated booking overlaps with existing bookings.
            if (IsBookingOverlapping(bookingDTO))
            {
                return BadRequest("Booking is overlapping with another booking.");
            }

            // Find the original booking in the database.
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found.");
            }

            // Update booking dates based on the DTO.
            booking.CheckIn = bookingDTO.CheckIn;
            booking.CheckOut = bookingDTO.CheckOut;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Check if the booking exists before rethrowing concurrency exceptions.
                if (!BookingExists(id))
                {
                    return NotFound("Booking not found during update.");
                }
                throw; // Rethrow the exception if it's not handled.
            }
            catch (DbUpdateException ex)
            {
                // Return a 500 Internal Server Error in case of a database update failure.
                return StatusCode(500, $"Database update error: {ex.Message}");
            }

            // Return 204 No Content to indicate success with no body content.
            return NoContent();
        }

        /// <summary>
        /// Deletes a booking by its ID.
        /// </summary>
        /// <param name="id">The ID of the booking to delete.</param>
        /// <returns>An action result indicating the outcome of the deletion.</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            // Retrieve the booking to delete from the database.
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Remove the booking and save changes.
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            // Return 204 No Content on successful deletion.
            return NoContent();
        }

        /// <summary>
        /// Helper method to check if a booking exists in the database.
        /// </summary>
        /// <param name="id">The ID of the booking.</param>
        /// <returns>True if the booking exists, otherwise false.</returns>
        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }

        /// <summary>
        /// Helper method to determine if a new booking overlaps with existing bookings.
        /// </summary>
        /// <param name="newBooking">The new booking to check for overlaps.</param>
        /// <returns>True if there is an overlap, otherwise false.</returns>
        private bool IsBookingOverlapping(BookingDTO newBooking)
        {
            return _context.Bookings
                .Any(b => b.RoomId == newBooking.RoomId &&                                              // Check for the same room
                          b.Id != newBooking.Id &&                                                      // Exclude the current booking when updating
                          ((newBooking.CheckIn < b.CheckOut) && (newBooking.CheckOut > b.CheckIn))      // Check for date overlap
                    );
        }

        /// <summary>
        /// Helper method to determine if a booking overlaps with existing bookings.
        /// </summary>
        /// <param name="newBooking">The new booking to check for overlaps.</param>
        /// <returns>True if there is an overlap, otherwise false.</returns>
        private bool IsBookingOverlapping(Booking newBooking)
        {
            return _context.Bookings
                .Any(b => b.RoomId == newBooking.RoomId &&                                              // Check for the same room
                          b.Id != newBooking.Id &&                                                      // Exclude the current booking when updating
                          ((newBooking.CheckIn < b.CheckOut) && (newBooking.CheckOut > b.CheckIn))      // Check for date overlap
                    );
        }

        /// <summary>
        /// Returns first available room of the type provided within available dates
        /// </summary>
        /// <param name="checkIn"></param>
        /// <param name="checkOut"></param>
        /// <param name="roomType"></param>
        /// <returns></returns>
        private Room FirstAvailableRoom(DateTime checkIn, DateTime checkOut, int roomTypeId)
        {
            // Get all rooms of the specified type
            var rooms = _context.Rooms.Where(r => r.RoomType.Id == roomTypeId).ToList();

            // Check each room for availability
            foreach (var room in rooms)
            {
                // Check if the room is available for the specified dates
                if (!_context.Bookings.Any(b => b.RoomId == room.Id &&
                                                ((checkIn < b.CheckOut) && (checkOut > b.CheckIn))))
                {
                    return room;
                }
            }

            return null;
        }
    }
}
