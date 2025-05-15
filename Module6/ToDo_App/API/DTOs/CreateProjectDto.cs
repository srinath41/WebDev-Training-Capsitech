namespace API.DTOs;

public class CreateProjectDto
{
    public string title { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public string category { get; set; } = string.Empty;
    public List<string> assignedUsers { get; set; } = new();
    public DateTime startDate { get; set; }
    public DateTime endDate { get; set; }
}
