using System.Text.Json.Serialization;

namespace DomainModels.Models.Entities
{
    public class RoomType
    {
        public int Id { get; set; }
        public string RoomTypeName { get; set; } = "Standard";

        [JsonIgnore]
        public List<Room> Rooms { get; set; }

    }
}
