namespace API.Models.Entities
{
    public class RoomType
    {
        public int Id { get; set; }
        public string RoomTypeName { get; set; }
        public List<string> Tags { get; set; }

        public List<Room> Rooms { get; set; }

    }
}
