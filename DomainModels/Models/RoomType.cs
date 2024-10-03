using System.Text.Json.Serialization;

//Class to handle room type
namespace DomainModels.Models.Entities
{
    public class RoomType
    {
        public int Id { get; set; }
        public string RoomTypeName { get; set; } = "Standard";

        //JsonIgnore to avoid errors in post requests for room.
        [JsonIgnore]
        public List<Room> Rooms { get; set; }

    }
}
