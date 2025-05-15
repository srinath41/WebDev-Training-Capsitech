using API.DTOs;
using API.Models;

namespace API.Services;

public interface IProjectService
{
    Task<ProjectDto?> CreateAsync(CreateProjectDto dto, string creatorId);
    Task<bool> UpdateAsync(string id, UpdateProjectDto dto);
    Task<bool> DeleteAsync(string id); // Hard delete (admin only)
    Task<ProjectDto?> GetByIdAsync(string id, string requesterId, string role);
    Task<(List<ProjectDto> Projects, long TotalCount)> GetAllAsync(string requesterId, string role, QueryProjectDto queryParameters);
    Task<List<UserDto>?> GetProjectUsersAsync(string id);

}
