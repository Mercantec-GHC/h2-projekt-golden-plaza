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
        return await _context.Bookings.ToListAsync();
    }

    // GET: api/Booking/CheckAvailability
    [HttpGet("CheckAvailability")]
    public async Task<ActionResult<IEnumerable<Booking>>> CheckAvailability(int roomId, DateTime startDate, DateTime endDate)
    {
        var availableDates = await _context.Bookings
            .Where(b => b.RoomId == roomId && b.Date >= startDate && b.Date <= endDate && !b.IsReserved)
            .ToListAsync();

        if (!availableDates.Any())
        {
            return NotFound(new { message = "No available dates for the selected room and date range." });
        }

        return Ok(availableDates);
    }

    // GET: api/Booking/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound();
        }

        return booking;
    }

    [HttpPut("BookRoom")]
    public async Task<IActionResult> BookRoom([FromQuery] int roomId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int customerId)
    {
        // Ensure the dates are in UTC
        startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

        if (startDate > endDate)
        {
            return BadRequest(new { message = "Start date cannot be after end date." });
        }

        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null)
        {
            return NotFound(new { message = "Room not found." });
        }

        var availabilities = await _context.Bookings
            .Where(b => b.RoomId == roomId && b.Date >= startDate && b.Date <= endDate && !b.IsReserved)
            .ToListAsync();

        if (!availabilities.Any())
        {
            return BadRequest(new { message = "The room is not available for the selected dates." });
        }

        var customer = await _context.Customers.FindAsync(customerId);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found." });
        }

        foreach (var availability in availabilities)
        {
            availability.IsReserved = true;
            availability.CustomerId = customerId;  // Assign the CustomerId
            _context.Entry(availability).State = EntityState.Modified;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException ex)
        {
           
            return Conflict(new { message = "A conflict occurred while updating the booking." });
        }

        return Ok(new { message = "Room booked successfully.", roomId, startDate, endDate });
    }


// POST: api/Booking
    [HttpPost]
    public async Task<ActionResult<Booking>> PostBooking(Booking booking)
    {
        var customer = await _context.Customers.FindAsync(booking.CustomerId);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        var room = await _context.Rooms.FindAsync(booking.RoomId);
        if (room == null)
        {
            return NotFound(new { message = "Room not found" });
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