using API.Data;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RoomTypeController : Controller
{
    // setting the database context, so that we can create sql queries to the database
    private readonly ApplicationDBContext _context;

    public RoomTypeController(ApplicationDBContext context)
    {
        _context = context;
    }

    // GET: api/RoomType
    /// <summary>
    /// This endpoint returns all room types
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypes()
    {
        // Return all room types from the database as a list
        return await _context.RoomType.ToListAsync();
    }

    // GET: api/RoomType/5
    /// <summary>
    /// This endpoint returns a specific room type by its id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        // instantiate a room type object that holds the room type with the id
        var roomType = await _context.RoomType.FindAsync(id);

        // checks if the room type is null, if it is, return not found.
        if (roomType == null)
        {
            return NotFound();
        }

        return roomType;
    }

    // POST: api/RoomType
    /// <summary>
    /// This endpoint creates a new room type
    /// </summary>
    /// <param name="roomtypename"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<RoomType>> PostRoomType([FromBody] string roomtypename)
    {
        // instantiate a new room type object
        RoomType roomType = new RoomType();

        // set the room type name to the room type name passed in the body
        roomType.RoomTypeName = roomtypename;

        // add the room type to the database
        _context.RoomType.Add(roomType);

        // save the changes to the database
        await _context.SaveChangesAsync();

        // return the created room type
        return CreatedAtAction("GetRoomType", new { id = roomType.Id }, roomType);
    }

    // PUT: api/RoomType/5
    /// <summary>
    /// This endpoint updates a specific room type by its id
    /// </summary>
    /// <param name="id"></param>
    /// <param name="roomtypename"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    public async Task<ActionResult> PutRoomType(int id, [FromBody] string roomtypename)
    {
        // instantiate a room type object that holds the room type with the id
        var roomType = await _context.RoomType.FindAsync(id);

        // checks if the room type is null, if it is, return not found.
        if (roomType == null)
        {
            return NotFound();
        }
        // set the room type name to the room type name passed in the body
        roomType.RoomTypeName = roomtypename;

        // set the state of the room type to modified. This is because we are updating the room type
        _context.Entry(roomType).State = EntityState.Modified;

        // tries to save the changes to the database, if it fails, return a bad request with the error. 
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
    /// <summary>
    /// This endpoint deletes a specific room type by its id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRoomType(int id)
    {
        // instantiate a room type object that holds the room type with the id
        var roomType = await _context.RoomType.FindAsync(id);

        // checks if the room type is null, if it is, return not found.
        if (roomType == null)
        {
            return NotFound();
        }

        // remove the room type from the database
        _context.RoomType.Remove(roomType);

        // save the changes to the database
        await _context.SaveChangesAsync();

        return Ok();
    }

}