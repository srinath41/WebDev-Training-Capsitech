using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models;

public class Project
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    [BsonElement("title")]
    public string title { get; set; } = string.Empty;
    [BsonElement("description")]
    public string description { get; set; } = string.Empty;
    [BsonElement("category")]
    public string category { get; set; } = string.Empty;
    [BsonElement("projectStatus")]
    public string projectStatus { get; set; } = "Pending"; // Default
    [BsonElement("startDate")]
    public DateTime startDate { get; set; }
    [BsonElement("endDate")]
    public DateTime endDate { get; set; }
    [BsonElement("isDelete")]
    public bool isDelete { get; set; } = false; // Soft delete
    [BsonElement("assignedUsers")]
    public List<string> assignedUsers { get; set; } = new();
    [BsonElement("createdBy")]
    public string createdBy { get; set; } = string.Empty;
    [BsonElement("createdAt")]
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    [BsonElement("updatedAt")]
    public DateTime updatedAt { get; set; } = DateTime.UtcNow;
}
