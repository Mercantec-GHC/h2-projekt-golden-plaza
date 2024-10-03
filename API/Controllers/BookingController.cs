using API.Data;
using DomainModels.DTO;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public BookingController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // GET: api/Booking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // POST: api/Booking
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            if (IsBookingOverlapping(booking))
            {
                return BadRequest("Booking is overlapping with another booking");
            }


            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        // PUT: api/Booking/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, BookingDTO bookingDTO)
        {
            if (id != bookingDTO.Id)
            {
                return BadRequest();
            }

            if (IsBookingOverlapping(bookingDTO))
            {
                return BadRequest("Booking is overlapping with another booking");
            }

            // Find the booking in the database
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found.");
            }

            // Update the booking date
            booking.CheckIn = bookingDTO.CheckIn;
            booking.CheckOut = bookingDTO.CheckOut;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                {
                    return NotFound("Booking not found during update.");
                }
                throw; // Rethrow the exception if not a concurrency issue
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update error: {ex.Message}");
            }

            return NoContent(); // Return 204 No Content on success
        }

        // DELETE: api/Booking/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }

        private bool IsBookingOverlapping(BookingDTO newBooking)
        {
            return _context.Bookings
                .Any(b => b.RoomId == newBooking.RoomId &&
                  b.Id != newBooking.Id && // Exclude the current booking when updating
                  ((newBooking.CheckIn < b.CheckOut) && (newBooking.CheckOut > b.CheckIn)));
        }

        private bool IsBookingOverlapping(Booking newBooking)
        {
            return _context.Bookings
                .Any(b => b.RoomId == newBooking.RoomId &&
                  b.Id != newBooking.Id && // Exclude the current booking when updating
                  ((newBooking.CheckIn < b.CheckOut) && (newBooking.CheckOut > b.CheckIn)));
        }
    }
}