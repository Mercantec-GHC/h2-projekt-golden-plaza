using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities;

public class User
{
   
    public int UserId { get; set; }
    public string LoginStatus { get; set; }
    public DateTime RegisterDate { get; set; }
    public string UserPassword { get; set; }
}