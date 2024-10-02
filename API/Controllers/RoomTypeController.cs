using API.Data;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RoomTypeController : Controller
{

    private readonly ApplicationDBContext _context;

    public RoomTypeController(ApplicationDBContext context)
    {
        _context = context;
    }

    // GET: api/RoomType
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypes()
    {
        return await _context.RoomType.ToListAsync();
    }

    // GET: api/RoomType/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        var roomType = await _context.RoomType.FindAsync(id);

        if (roomType == null)
        {
            return NotFound();
        }

        return roomType;
    }

    // POST: api/RoomType
    [HttpPost]
    public async Task<ActionResult<RoomType>> PostRoomType([FromBody] string roomtypename)
    {
        RoomType roomType = new RoomType();
        roomType.RoomTypeName = roomtypename;

        _context.RoomType.Add(roomType);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRoomType", new { id = roomType.Id }, roomType);
    }

    // PUT: api/RoomType/5
    [HttpPut("{id}")]
    public async Task<ActionResult> PutRoomType(int id, [FromBody] string roomtypename)
    {
        var roomType = await _context.RoomType.FindAsync(id);

        if (roomType == null)
        {
            return NotFound();
        }

        roomType.RoomTypeName = roomtypename;

        _context.Entry(roomType).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException e)
        {
            // Return error message
            return BadRequest(e.Message);
        }

        return Ok();
    }

    // DELETE: api/RoomType/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRoomType(int id)
    {
        var roomType = await _context.RoomType.FindAsync(id);

        if (roomType == null)
        {
            return NotFound();
        }

        _context.RoomType.Remove(roomType);
        await _context.SaveChangesAsync();

        return Ok();
    }

}