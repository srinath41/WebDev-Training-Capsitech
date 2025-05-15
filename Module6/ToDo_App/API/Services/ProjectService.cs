using API.DTOs;
using API.Helpers;
using API.Models;
using API.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace API.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repo;
    private readonly IUserRepository _userRepo;

    public ProjectService(IProjectRepository repo, IUserRepository userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }

    public async Task<ProjectDto?> CreateAsync(CreateProjectDto dto, string creatorId)
    {
        var validAssignedUsers = new List<string>();

        foreach (var userId in dto.assignedUsers)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user != null && user.isActive)
                validAssignedUsers.Add(userId);
        }

        var project = new Project
        {
            title = dto.title,
            description = dto.description,
            category = dto.category,
            assignedUsers = validAssignedUsers,
            startDate = dto.startDate,
            endDate = dto.endDate,
            projectStatus = "Pending",
            isDelete = false,
            createdBy = creatorId
        };

        await _repo.CreateAsync(project);
        return await ToDto(project);
    }

    public async Task<bool> UpdateAsync(string id, UpdateProjectDto dto)
    {
        var project = await _repo.GetByIdAsync(id);
        if (project == null) return false;

        if (dto.title != null) project.title = dto.title;
        if (dto.description != null) project.description = dto.description;
        if (dto.category != null) project.category = dto.category;
        if (dto.projectStatus != null) project.projectStatus = dto.projectStatus;
        if (dto.startDate != null) project.startDate = dto.startDate.Value;
        if (dto.endDate != null) project.endDate = dto.endDate.Value;
        if (dto.isDelete != null) project.isDelete = dto.isDelete.Value;

        if (dto.assignedUsers != null)
        {
            var validUsers = new List<string>();
            foreach (var userId in dto.assignedUsers)
            {
                var user = await _userRepo.GetByIdAsync(userId);
                if (user != null && user.isActive)
                    validUsers.Add(userId);
            }
            project.assignedUsers = validUsers;
        }

        await _repo.UpdateAsync(project);
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var project = await _repo.GetByIdAsync(id);
        if (project == null) return false;

        await _repo.DeleteAsync(id);
        return true;
    }

    public async Task<ProjectDto?> GetByIdAsync(string id, string requesterId, string role)
    {
        var project = await _repo.GetByIdAsync(id);
        if (project == null) return null;

        if (role == "admin" || (project.assignedUsers.Contains(requesterId) && !project.isDelete))
            return await ToDto(project);

        return null;
    }

    public async Task<(List<ProjectDto> Projects, long TotalCount)> GetAllAsync(string requesterId, string role, QueryProjectDto parameters)
{
    // Get base query based on user role
    var baseQuery = role == "admin" 
        ? (await _repo.GetAllAsync()).AsQueryable()
        : (await _repo.GetByUserAsync(requesterId)).AsQueryable();

    // Apply search filter
    if (!string.IsNullOrEmpty(parameters.Search))
    {
        baseQuery = baseQuery.Where(p => p.title.ToLower().Contains(parameters.Search.ToLower()));
    }

    // Apply status filter
    if (!string.IsNullOrEmpty(parameters.Status))
    {
        if (parameters.Status == "isDeleted")
        {
            // Special case for showing only deleted projects
            baseQuery = baseQuery.Where(p => p.isDelete);
        }
        else if (parameters.Status == "active")
        {
            baseQuery = baseQuery.Where(p => !p.isDelete);
        }
        else
        {
            // Show active projects with matching status
            baseQuery = baseQuery.Where(p => p.projectStatus == parameters.Status && !p.isDelete);
        }
    }
    else
    {
        // When no status filter is selected
        if (parameters.IsDeleted.HasValue)
        {
            // If IsDeleted filter is explicitly set (true/false)
            baseQuery = baseQuery.Where(p => p.isDelete == parameters.IsDeleted.Value);
        }
        else if (role != "admin")
        {
            // For non-admin users, show only non-deleted projects by default
            baseQuery = baseQuery.Where(p => !p.isDelete);
        }
        // For admin users with no status filter and no IsDeleted filter, show all projects (including deleted)
    }

    // Apply category filter
    if (!string.IsNullOrEmpty(parameters.Category))
    {
        baseQuery = baseQuery.Where(p => p.category == parameters.Category);
    }

    // Get total count before pagination
    var totalCount = baseQuery.Count();

    // Apply sorting
    if (!string.IsNullOrEmpty(parameters.SortBy))
    {
        bool desc = parameters.SortDescending ?? false;

        baseQuery = parameters.SortBy.ToLower() switch
        {
            "title" => desc ? baseQuery.OrderByDescending(p => p.title) : baseQuery.OrderBy(p => p.title),
            "startdate" => desc ? baseQuery.OrderByDescending(p => p.startDate) : baseQuery.OrderBy(p => p.startDate),
            "enddate" => desc ? baseQuery.OrderByDescending(p => p.endDate) : baseQuery.OrderBy(p => p.endDate),
            _ => baseQuery.OrderBy(p => p.title) // Default sort by title A-Z
        };
    }
    else
    {
        // Default sort by title A-Z if no sort specified
        baseQuery = baseQuery.OrderBy(p => p.title);
    }

    // Apply pagination
    int skip = (parameters.Page - 1) * parameters.PerPage;
    var projects = baseQuery.Skip(skip).Take(parameters.PerPage).ToList();

    // Convert to DTOs
    var projectDtos = new List<ProjectDto>();
    foreach (var project in projects)
    {
        projectDtos.Add(await ToDto(project));
    }

    return (projectDtos, totalCount);
}

    public async Task<List<UserDto>?> GetProjectUsersAsync(string id)
{
    var project = await _repo.GetByIdAsync(id); // ✅ Use _repo, not ProjectRepository
    if (project == null) return null;

    var users = await _userRepo.GetByIdsAsync(project.assignedUsers); // ✅ Use _userRepo, not UserRepository
    if (users == null || users.Count == 0) return new List<UserDto>();
    
    return users.Select(u => new UserDto
    {
        Id = u.Id,
        name = u.name,
        email = u.email,
        role = u.role,
        isActive = u.isActive
    }).ToList();
}



    private async Task<ProjectDto> ToDto(Project p)
{
    var users = await _userRepo.GetByIdsAsync(p.assignedUsers);  // Fetch user details based on IDs
    var userDtos = users.Select(u => new UserDto
    {
        Id = u.Id,
        name = u.name,
        email = u.email,
        role = u.role,
        isActive = u.isActive
    }).ToList();

    return new ProjectDto
    {
        Id = p.Id,
        title = p.title,
        description = p.description,
        category = p.category,
        projectStatus = p.projectStatus,
        startDate = p.startDate,
        endDate = p.endDate,
        isDelete = p.isDelete,
        assignedUsers = userDtos,  // Now it contains full user data instead of just IDs
        createdBy = p.createdBy
    };
}

}
