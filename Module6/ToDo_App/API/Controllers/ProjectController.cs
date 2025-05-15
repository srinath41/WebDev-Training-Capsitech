using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MongoDB.Bson;

namespace API.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly IUserService _userService;

    public ProjectController(IProjectService projectService, IUserService userService)
    {
        _projectService = projectService;
        _userService = userService;
    }

    // Create project (Admin only)
    [Authorize(Roles = "admin")]
    [HttpPost]
    
    public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the logged-in user's ID (creator)
        if (userId == null) return Unauthorized();

        var project = await _projectService.CreateAsync(dto, userId);
        if (project == null) return BadRequest("Failed to create project.");
        return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
    }

    // Update project (Admin only)
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProject(string id, [FromBody] UpdateProjectDto dto)
    {
        var updated = await _projectService.UpdateAsync(id, dto);
        if (!updated) return NotFound("Project not found or invalid data.");
        return NoContent();
    }

    // Delete project permanently (Admin only)
    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProject(string id)
    {
        var deleted = await _projectService.DeleteAsync(id);
        if (!deleted) return NotFound("Project not found.");
        return NoContent();
    }

    // Get all projects (Admin can see all, users can only see assigned non-deleted projects)
    [HttpGet]
[Authorize]
public async Task<ActionResult> GetAllProjects(
    [FromQuery] string? search,
    [FromQuery] string? status,
    [FromQuery] string? category,
    [FromQuery] bool? isDeleted,
    [FromQuery] string? sortBy,
    [FromQuery] bool? sortDescending,
    [FromQuery] int page = 1,
    [FromQuery] int perPage = 6)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var role = User.IsInRole("admin") ? "admin" : "user";

    if (userId == null) return Unauthorized();

    var queryParameters = new QueryProjectDto
    {
        Search = search,
        Status = status,
        Category = category,
        IsDeleted = isDeleted,
        SortBy = sortBy,
        SortDescending = sortDescending,
        Page = page,
        PerPage = perPage
    };

    var (projects, totalCount) = await _projectService.GetAllAsync(userId, role, queryParameters);
    
    // Calculate total pages
    var totalPages = (int)Math.Ceiling((double)totalCount / perPage);
    
    // Create pagination response
    var response = new
    {
        Data = projects,
        Pagination = new
        {
            CurrentPage = page,
            PerPage = perPage,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPreviousPage = page > 1
        }
    };
    
    return Ok(response);
}

    // Get project by ID (Admin can see all, users can see assigned and non-deleted)
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ProjectDto>> GetProjectById(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.IsInRole("admin") ? "admin" : "user"; // Determine user role

        if (userId == null) return Unauthorized();

        var project = await _projectService.GetByIdAsync(id, userId, role);
        if (project == null) return NotFound("Project not found.");
        return Ok(project);
    }

    [HttpGet("{id}/users")]
[Authorize]
public async Task<IActionResult> GetProjectUsers(string id)
{
    if (!ObjectId.TryParse(id, out _))
        return BadRequest(new { message = "Invalid project ID" });

    var users = await _projectService.GetProjectUsersAsync(id);
    if (users == null)
        return NotFound(new { message = "Project not found" });

    return Ok(users);
}

}
