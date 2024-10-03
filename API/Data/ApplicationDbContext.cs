using DomainModels.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

//this file ensures that we get the right tables in our database
public class ApplicationDBContext : DbContext
{
    public DbSet<Room> Rooms { get; set; } //makes the Rooms table
    public DbSet<RoomType> RoomType { get; set; } //makes the RoomType table
    public DbSet<Booking> Bookings { get; set; } //makes the Bookings table
    public DbSet<Ticket> Tickets { get; set; } //makes the Tickets table

    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }
}
