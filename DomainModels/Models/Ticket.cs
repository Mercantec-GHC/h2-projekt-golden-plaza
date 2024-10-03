namespace DomainModels.Models.Entities
{
    //Class to handle Tickets
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Status status { get; set; }
        public string UserId { get; set; }

    }

    public enum Status
    {
        WorkInProgress,
        ClosedCompleted,
        ClosedSkipped
    }
}

