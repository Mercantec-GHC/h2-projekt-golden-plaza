using System.ComponentModel.DataAnnotations;

namespace DomainModels.Models.Entities;

public class User
{ 
    public int UserId { get; set; }
    public DateTime RegisterDate { get; set; }
}