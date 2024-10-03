using DomainModels.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDBContext : DbContext
{
    public DbSet<Room> Rooms { get; set; }
    public DbSet<RoomType> RoomType { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Ticket> Tickets { get; set; }

    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }
}
