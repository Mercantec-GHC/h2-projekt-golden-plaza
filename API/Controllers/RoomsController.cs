using API.Data;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using DomainModels.DTO;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDBContext _context;

    public RoomsController(ApplicationDBContext context)
    {
        // Fill the DB Context through Dependency Injection
        _context = context;
    }

    /// <summary>
    /// Get all Rooms
    /// </summary>
    /// <returns>Returns Rooms</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        //Simple CRUD operation
        return await _context.Rooms.Include(r => r.RoomType).ToListAsync();
    }

    /// <summary>
    /// Return room based on ID
    /// </summary>
    /// <param name="id">The way we sort the rooms in the database</param>
    /// <returns>Room</returns>
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


    /// <summary>
    /// Update Rooms by ID
    /// </summary>
    /// <param name="id">The specifc room we try to find</param>
    /// <param name="room">The Room and information in question</param>
    /// <returns>No Content</returns>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutRoom(int id, CreateRoomDTO roomdto)
    {
        //Simple Crud Operation

        Room? room = await _context.Rooms.FindAsync(id);

        if (room == null)
            return NotFound("Room does not exist");

        RoomType? roomType = await _context.RoomType.FindAsync(roomdto.RoomTypeId);

        if (roomType == null)
            return BadRequest("Room Type does not exist");

        room.Capacity = roomdto.Capacity;
        room.RoomNumber = roomdto.RoomNumber;
        room.PricePerNight = roomdto.PricePerNight;
        room.Facilities = roomdto.Facilities;
        room.RoomType = roomType;

        _context.Entry(room).State = EntityState.Modified;


        //Saves changes or discards them.
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


    /// <summary>
    /// Add a new room
    /// </summary>
    /// <param name="roomDTO">Room object</param>
    /// <returns>The newly created room</returns>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Room>> PostRoom(RoomDTO roomDTO)
    {
        var roomType = await _context.RoomType.FirstOrDefaultAsync(rt => rt.Id == roomDTO.RoomTypeId);

        if (roomType == null)
        {
            return BadRequest("Room Type does not exist");
        }

        //We update the room objects with the new values from the RoomDTO object.
        var room = new Room
        {
            Capacity = roomDTO.Capacity,
            RoomType = roomType,
            RoomNumber = roomDTO.RoomNumber,
            PricePerNight = roomDTO.PricePerNight,
            Facilities = roomDTO.Facilities
        };

        //Simple CRUD operation
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room); //Returns the newly created room
    }

    /// <summary>
    /// Method that deletes a room based on ID.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
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