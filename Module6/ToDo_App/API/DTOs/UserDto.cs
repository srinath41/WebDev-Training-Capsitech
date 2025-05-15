namespace API.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string role { get; set; } = "user";
    public bool isActive { get; set; } = true;
    public string token { get; set; } = string.Empty;
}