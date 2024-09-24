using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class CustomerDTO
    {
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public string Address { get; set; }
    }
}
