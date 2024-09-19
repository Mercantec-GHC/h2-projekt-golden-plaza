using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Query.Internal;
using API.Models.Entities;

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
        //fetch all tickets
        [HttpGet]
        public IActionResult GetAll()
        {
            var ticket = _context.Tickets.ToList();

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }
        //fetch the id of a ticket
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var ticket = _context.Tickets.Find(id);
            //Just in case null, returns not found
            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }
        // adding a new ticket
        [HttpPost]
        public IActionResult Post([FromBody] Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
        // updating an already existing ticket, this can also be a part of the message/reply feature for now
        [HttpPut]
        public IActionResult Update([FromBody] Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
        // removing/deleting an existing ticket, may want to do so in another way in the future, where it instead stores the ticket
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ticket = _context.Tickets.Find(id);
            _context.Tickets.Remove(ticket);
            _context.SaveChanges();
            return Ok(ticket);
        }
    }
}
