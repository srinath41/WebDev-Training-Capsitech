using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    [BsonElement("name")]
    public string name { get; set; } = string.Empty;
    [BsonElement("email")]
    public string email { get; set; } = string.Empty;
    [BsonElement("password")]
    public string password { get; set; } = string.Empty;
    [BsonElement("role")]
    public string role { get; set; } = "user"; // "admin" or "user"
    [BsonElement("isActive")]
    public bool isActive { get; set; } = true;
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime updatedAt { get; set; } = DateTime.UtcNow;
}
