using Microsoft.AspNetCore.Mvc;
using API.Data;
using DomainModels.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    // This class is a controller class that handles the HTTP requests for the User entity
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public TicketController(ApplicationDBContext context)
        {
            _context = context;
        }
        /// <summary>
        /// fetches all tickets.
        /// </summary>
        /// <returns>An action result showcasing tickets.</returns>
        //fetch all tickets, requires login so user will only be able to see their own tickets
        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var ticket = _context.Tickets.ToList();

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }
        /// <summary>
        /// get tickets based on UserSid.
        /// </summary>
        /// <param name="userSid">Is used to Fetch the users Sid.</param>
        /// <returns>An action result showcasing all tickets for that user.</returns>
        //fetch the id of a ticket with userSid
        [HttpGet("{userSid}")]
        public IActionResult GetById([FromRoute] string userSid)
        {
            var ticket = _context.Tickets.Where(t => t.UserId == userSid);
            //Just in case null, returns not found
            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }
        /// <summary>
        /// Adds a ticket.
        /// </summary>
        /// <param name="ticket">The call to the ticket class.</param>
        /// <returns>An action result with the newly created ticket.</returns>
        // adding a new ticket, requires login to perform action
        [HttpPost]
        [Authorize]
        public IActionResult Post([FromBody] Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
        /// <summary>
        /// Updates an existing ticket.
        /// </summary>
        /// <param name="ticket">the call for the ticket class.</param>
        /// <returns>An action result with the updated ticket.</returns>
        // updating an already existing ticket, requires login in order to perform
        [HttpPut]
        [Authorize]
        public IActionResult Update([FromBody] Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
        /// <summary>
        /// Delete a specific ticket.
        /// </summary>
        /// <param name="id">The id of the ticket to remove.</param>
        /// <returns>An action result with the ticket selected removed.</returns>
        // removing/deleting an existing ticket, may want to do so in another way in production, where it instead stores the ticket
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var ticket = _context.Tickets.Find(id);
            _context.Tickets.Remove(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
    }
}
