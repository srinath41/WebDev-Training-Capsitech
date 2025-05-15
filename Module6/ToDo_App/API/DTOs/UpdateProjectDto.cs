namespace API.DTOs;

public class UpdateProjectDto
{
    public string? title { get; set; }
    public string? description { get; set; }
    public string? category { get; set; }
    public string? projectStatus { get; set; } // "Pending", "In Progress", "Completed"
    public DateTime? startDate { get; set; }
    public DateTime? endDate { get; set; }
    public bool? isDelete { get; set; }
    public List<string>? assignedUsers { get; set; }
}
