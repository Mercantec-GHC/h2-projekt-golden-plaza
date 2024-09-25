using API.Data;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DomainModels.Models.Entities;

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
            return await _context.Rooms.ToListAsync();
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
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.Id)
            {
                return BadRequest();
            }

           
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
        public async Task<ActionResult<Room>> PostRoom(RoomDTO roomDTO) 
        {
            var room = new Room
            {
                Capacity = roomDTO.Capacity,
                RoomType = roomDTO.RoomType,
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