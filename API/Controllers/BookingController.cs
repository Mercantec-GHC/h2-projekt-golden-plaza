using API.Data;
using DomainModels.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Authorization;

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
    [Authorize]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        return await _context.Bookings.ToListAsync();
    }

    // GET: api/Booking/CheckAvailability
    [HttpGet("CheckAvailability")]
    public async Task<ActionResult> CheckAvailability(int roomId, DateTime startDate, DateTime endDate)
    {
        // Needed UTC because postgres exspects that.
        startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc); 
        endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

       
        if (startDate > endDate)
        {
            return BadRequest(new { message = "Start date cannot be after end date." });
        }

        // Query the database to find all bookings within the given date range for the specified room
        var availableDates = await _context.Bookings
            .Where(booking => booking.RoomId == roomId 
                              && booking.Date >= startDate 
                              && booking.Date <= endDate 
                              && !booking.IsReserved)
            .ToListAsync();

        
        if (!availableDates.Any())
        {
            return NotFound(new { message = "No available dates for the selected room and date range." });
        }

        // Calculate the total price for the available dates
        var totalPrice = availableDates.Sum(booking => booking.Price);

    
        return Ok(new
        {
            AvailableDates = availableDates.Select(booking => new { booking.Date, booking.Price }),
            TotalPrice = totalPrice
        });
    }

    // GET: api/Booking/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(booking => booking.Id == id);

        if (booking == null)
        {
            return NotFound();
        }

        return booking;
    }

    [HttpPut("BookRoom")]
    public async Task<IActionResult> BookRoom(int roomId, DateTime startDate, DateTime endDate, int UserId) //customerId is the ID of the customer who is booking the room
    {
        startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc); // Needed UTC because postgres exspects that.
        endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

        if (startDate > endDate)
        {
            return BadRequest(new { message = "Start date cannot be after end date." });
        }

        // Load room and customer based on their IDs
        var room = await _context.Rooms.FindAsync(roomId);
        var customer = await _context.Customers.FindAsync(UserId);

        if (room == null || customer == null)
        {
            return NotFound(new { message = "Room or Customer not found." });
        }

        //queries the database to check for available bookings for the specified room within the given date range.
        //It filters bookings where the room is not already reserved.
        var availabilities = await _context.Bookings
            .Where(booking => booking.Room == room && booking.Date >= startDate && booking.Date <= endDate && !booking.IsReserved)
            .ToListAsync();

        if (!availabilities.Any())
        {
            return BadRequest(new { message = "The room is not available for the selected dates." });
        }

        //Loops through each room in availabilities-list and mark it as reserved by setting it to "true"
        // Assigns CustomerID to each booking, linking the reservation to the customer who made the booking.
        availabilities.ForEach(booking =>
        {
            booking.IsReserved = true;
            booking.Customer = customer;
        });

        await _context.SaveChangesAsync();

        return Ok(new { message = "Room booked successfully.", roomId, startDate, endDate });
    }

    // POST: api/Booking
    [HttpPost]
    public async Task<ActionResult<Booking>> PostBooking(BookingDTO bookingDTO)
    {
        // Check if the customer exists
        var customer = await _context.Customers.FindAsync(bookingDTO.UserId);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        // Check if the room exists
        var room = await _context.Rooms.FindAsync(bookingDTO.RoomId);
        if (room == null)
        {
            return NotFound(new { message = "Room not found" });
        }

        // Create a new Booking entity
        var booking = new Booking
        {
            Date = bookingDTO.Date,
            Price = bookingDTO.Price,
            IsReserved = bookingDTO.IsReserved,
            Customer = customer, // Link the customer
            Room = room,         // Link the room
            RoomId = bookingDTO.RoomId,
            UserId = bookingDTO.UserId // Assign CustomerId
        };

        // Add the booking to the context and save
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Return the newly created booking with its ID
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking); // Return the Booking object
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