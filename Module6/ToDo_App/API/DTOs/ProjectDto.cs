namespace API.DTOs;

public class ProjectDto
{
    public string Id { get; set; } = string.Empty;
    public string title { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public string category { get; set; } = string.Empty;
    public string projectStatus { get; set; } = "Pending";
    public DateTime startDate { get; set; }
    public DateTime endDate { get; set; }
    public bool isDelete { get; set; }
    public List<UserDto> assignedUsers { get; set; } = new List<UserDto>();
    public string createdBy { get; set; } = string.Empty;
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
}
