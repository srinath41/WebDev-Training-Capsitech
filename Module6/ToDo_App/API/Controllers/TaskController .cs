using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IProjectService _projectService;

    public TasksController(ITaskService taskService, IProjectService projectService)
    {
        _taskService = taskService;
        _projectService = projectService;
    }

    [HttpGet("{projectId}")]
    [Authorize]
    public async Task<IActionResult> GetTasks(string projectId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var isAdmin = User.IsInRole("admin");

        try
        {
            var tasks = await _taskService.GetTasks(projectId, userId, isAdmin);
            return Ok(tasks);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{projectId}")]
    public async Task<IActionResult> CreateTask(string projectId, [FromBody] CreateTaskDto taskDto)
    {
        Console.WriteLine($"User: {User.Identity?.Name}");
        Console.WriteLine($"Roles: {string.Join(",", User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value))}");
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            Console.WriteLine("UserId not found in claims");
            return Unauthorized();
        }

        if (string.IsNullOrEmpty(taskDto.TaskTitle))
        {
            return BadRequest("Task title is required");
        }

        try
        {
            var taskItem = await _taskService.CreateTask(taskDto, projectId, userId);
            return CreatedAtAction(nameof(GetTasks), new { projectId }, taskItem);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{taskId}")]
    [Authorize]
    public async Task<IActionResult> UpdateTask(string taskId, [FromBody] UpdateTaskDto taskDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var isAdmin = User.IsInRole("admin");

        try
        {
            var taskItem = await _taskService.UpdateTask(taskId, taskDto, userId, isAdmin);
            return Ok(taskItem);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(string taskId)
    {
        var isAdmin = User.IsInRole("admin");

        try
        {
            await _taskService.DeleteTask(taskId, isAdmin);
            return Ok(new { message = "Task permanently deleted" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}