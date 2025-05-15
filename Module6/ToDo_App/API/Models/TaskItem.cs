using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models;

public class TaskItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    
    [BsonElement("taskTitle")]
    public string TaskTitle { get; set; } = string.Empty;
    
    [BsonElement("taskDescription")]
    public string TaskDescription { get; set; } = string.Empty;
    
    [BsonElement("taskStatus")]
    public string TaskStatus { get; set; } = "Pending"; // "Pending", "In Progress", "Completed"
    
    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }
    
    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }
    
    [BsonElement("isDelete")]
    public bool IsDelete { get; set; } = false;
    
    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; set; } = string.Empty;
    
    [BsonElement("assignedUsers")]
    public List<string> AssignedUsers { get; set; } = new(); // List of User IDs
    
    [BsonElement("createdBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedBy { get; set; } = string.Empty;
    
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}