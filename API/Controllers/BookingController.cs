using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models.Entities;

namespace API.Controllers;

[Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public BookingController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/RoomAvailability
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetRoomAvailabilities()
        {
            return await _context.Bookings
                .Include(ra => ra.Room)
                .ToListAsync();
        }

        // GET: api/RoomAvailability/CheckAvailability
        [HttpGet("CheckAvailability")]
        public async Task<ActionResult<IEnumerable<Booking>>> CheckAvailability(int roomId, DateTime startDate, DateTime endDate)
        {
            var availableDates = await _context.Bookings
                .Where(ra => ra.RoomId == roomId && ra.Date >= startDate && ra.Date <= endDate && !ra.IsReserved)
                .ToListAsync();

            if (!availableDates.Any())
            {
                return NotFound(new { message = "No available dates for the selected room and date range." });
            }

            return Ok(availableDates);
        }

        // GET: api/RoomAvailability/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetRoomAvailability(int id)
        {
            var roomAvailability = await _context.Bookings
                .Include(ra => ra.Room)
                .FirstOrDefaultAsync(ra => ra.Id == id);

            if (roomAvailability == null)
            {
                return NotFound();
            }

            return roomAvailability;
        }

        [HttpPut("BookRoom")]
        public async Task<IActionResult> BookRoom([FromQuery] int roomId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Ensure the dates are in UTC
            startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            if (startDate > endDate)
            {
                return BadRequest(new { message = "Start date cannot be after end date." });
            }

            var availabilities = await _context.Bookings
                .Where(ra => ra.RoomId == roomId && ra.Date >= startDate && ra.Date <= endDate && !ra.IsReserved)
                .ToListAsync();

            if (!availabilities.Any())
            {
                return BadRequest(new { message = "The room is not available for the selected dates." });
            }

            foreach (var availability in availabilities)
            {
                availability.IsReserved = true;
                _context.Entry(availability).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Log exception
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the database." });
            }

            return NoContent();
        }

        // PUT: api/RoomAvailability/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomAvailability(int id, Booking booking)
        {
            if (id != booking.Id)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomAvailabilityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/RoomAvailability
        [HttpPost]
        public async Task<ActionResult<Booking>> PostRoomAvailability(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoomAvailability), new { id = booking.Id }, booking);
        }

        // DELETE: api/RoomAvailability/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomAvailability(int id)
        {
            var roomAvailability = await _context.Bookings.FindAsync(id);
            if (roomAvailability == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(roomAvailability);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomAvailabilityExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }
    }