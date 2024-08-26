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

    // GET: api/Bookings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        return await _context.Bookings
            .Include(b => b.Room)
            .Include(b => b.Customer)
            .ToListAsync();
    }

    // GET: api/Booking/CheckAvailability
    [HttpGet("CheckAvailability")]
    public async Task<ActionResult<IEnumerable<Booking>>> CheckAvailability(int roomId, DateTime startDate, DateTime endDate)
    {
        var availableDates = await _context.Bookings
            .Where(ra => ra.RoomId == roomId && ra.Date >= startDate && ra.Date <= endDate && !ra.IsReserved)
            .ToListAsync();

        if (!availableDates.Any())
        {
            return NotFound();
        }

        return Ok(availableDates);
    }

    // GET: api/Booking/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.Room)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound();
        }

        return booking;
    }

    // PUT: api/Booking/BookRoom
    [HttpPut("BookRoom")]
    public async Task<IActionResult> BookRoom([FromQuery] int roomId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int customerId)
    {
        if (startDate > endDate)
        {
            return BadRequest();
        }

        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null)
        {
            return NotFound();
        }

        var availabilities = await _context.Bookings
            .Where(ra => ra.RoomId == roomId && ra.Date >= startDate && ra.Date <= endDate && !ra.IsReserved)
            .ToListAsync();

        if (!availabilities.Any())
        {
            return BadRequest();
        }

        var customer = await _context.Customers.FindAsync(customerId);
        if (customer == null)
        {
            return NotFound();
        }

        foreach (var availability in availabilities)
        {
            availability.IsReserved = true;
            availability.CustomerId = customerId;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    // POST: api/Booking
    [HttpPost]
    public async Task<ActionResult<Booking>> PostBooking(Booking booking)
    {
        if (!_context.Customers.Any(c => c.UserId == booking.CustomerId) || 
            !_context.Rooms.Any(r => r.Id == booking.RoomId))
        {
            return BadRequest();
        }

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    // DELETE: api/Booking/5
    [HttpDelete("{id}")]
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
}
