using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DomainModels.Models.Entities;
using DomainModels.DTO;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDBContext _context;

    public RoomsController(ApplicationDBContext context)
    {
        _context = context;
    }

    // GET: api/Rooms
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        return await _context.Rooms.Include(e => e.RoomType).ToListAsync();
    }

    // GET: api/Rooms/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoom(int id)
    {
        var room = await _context.Rooms //Query the database for the room with the specified ID
            //.Include(r => r.Availabilities)  // Ensure availabilities are included
            .FirstOrDefaultAsync(r => r.Id == id);// Use the FirstOrDefaultAsync method to retrieve the first room that matches the specified ID

        if (room == null)
        {
            return NotFound();
        }

        return room;
    }


    // PUT: api/Rooms/5
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutRoom(int id, CreateRoomDTO roomDTO)
    {

        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
        var newRoomType = await _context.RoomType.FirstOrDefaultAsync(t => t.Id == roomDTO.RoomTypeId);


        if (room == null)
            return BadRequest("Room not found!");

        if (roomDTO.RoomNumber != 0)
            room.RoomNumber = roomDTO.RoomNumber;
        if (roomDTO.Capacity != 0)
            room.Capacity = roomDTO.Capacity;
        if (newRoomType != null)
            room.RoomType = newRoomType;
        if (roomDTO.Facilities != null)
            room.Facilities = roomDTO.Facilities;
        if (roomDTO.PricePerNight != 0)
            room.PricePerNight = roomDTO.PricePerNight;

        _context.Rooms.Update(room);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Rooms.Any(e => e.Id == id))
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


    // POST: api/Rooms
        
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Room>> PostRoom(CreateRoomDTO roomDTO) 
    {
        var roomType = await _context.RoomType.FirstOrDefaultAsync(rt => rt.Id == roomDTO.RoomTypeId);
            
        if (roomType == null)
        {
            return BadRequest("Room Type does not exist");
        }

        var room = new Room
        {
            Capacity = roomDTO.Capacity,
            RoomType = roomType,
            RoomNumber = roomDTO.RoomNumber,
            PricePerNight = roomDTO.PricePerNight,
            Facilities = roomDTO.Facilities
        };    

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room); //Returns the newly created room
    }

    // DELETE: api/Rooms/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
        {
            return NotFound();
        }

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RoomExists(int id) //Helper method to check if a room with the specified ID exists
    {
        return _context.Rooms.Any(e => e.Id == id);
    }
}