using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class User
{ 
    public int UserId { get; set; }

    public DateTime RegisterDate { get; set; }
}