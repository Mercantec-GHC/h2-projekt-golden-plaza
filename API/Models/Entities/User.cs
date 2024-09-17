using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class User
{ 
    public Guid UserId { get; set; } = Guid.NewGuid();
    public DateTime RegisterDate { get; set; }
}