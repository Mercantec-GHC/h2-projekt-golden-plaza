namespace API.Models.Entities
{
    public class Employee : User
    {
        public int Id { get; set; }
        public string UPN { get; set; }
        public Department Department { get; set; }
        public string EmployeePhoneNumber { get; set; }

    }
}
