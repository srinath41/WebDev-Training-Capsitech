using API.DTOs;
using API.Models;
using API.Repositories;
using MongoDB.Driver;

namespace API.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;

    public TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
    }

    public async Task<IEnumerable<TaskItem>> GetTasks(string projectId, string userId, bool isAdmin)
    {
        // Check if user has access to the project
        var project = await _projectRepository.GetProjectById(projectId);
        if (project == null || (!isAdmin && project.createdBy != userId && !project.assignedUsers.Contains(userId)))
        {
            throw new UnauthorizedAccessException("You don't have access to this project");
        }

        return await _taskRepository.GetTasksForProject(projectId, userId, isAdmin);
    }

    public async Task<TaskItem> GetTask(string taskId)
    {
        return await _taskRepository.GetTaskById(taskId);
    }

    public async Task<TaskItem> CreateTask(CreateTaskDto taskDto, string projectId, string userId)
    {
        var taskItem = new TaskItem
        {
            TaskTitle = taskDto.TaskTitle,
            TaskDescription = taskDto.TaskDescription,
            TaskStatus = taskDto.TaskStatus,
            StartDate = taskDto.StartDate,
            EndDate = taskDto.EndDate,
            ProjectId = projectId,
            AssignedUsers = taskDto.AssignedUsers,
            CreatedBy = userId
        };

        return await _taskRepository.CreateTask(taskItem);
    }

    public async Task<TaskItem> UpdateTask(string taskId, UpdateTaskDto taskDto, string userId, bool isAdmin)
    {
        var taskItem = await _taskRepository.GetTaskById(taskId);
        if (taskItem == null)
        {
            throw new KeyNotFoundException("Task not found");
        }

        if (!isAdmin && !taskItem.AssignedUsers.Contains(userId))
        {
            throw new UnauthorizedAccessException("You are not assigned to this task");
        }

        if (isAdmin)
        {
            taskItem.TaskTitle = taskDto.TaskTitle ?? taskItem.TaskTitle;
            taskItem.TaskDescription = taskDto.TaskDescription ?? taskItem.TaskDescription;
            taskItem.StartDate = taskDto.StartDate ?? taskItem.StartDate;
            taskItem.EndDate = taskDto.EndDate ?? taskItem.EndDate;
            taskItem.AssignedUsers = taskDto.AssignedUsers ?? taskItem.AssignedUsers;
            taskItem.IsDelete = taskDto.IsDelete ?? taskItem.IsDelete;
        }
        
        // Both admin and assigned users can update status
        taskItem.TaskStatus = taskDto.TaskStatus ?? taskItem.TaskStatus;

        return await _taskRepository.UpdateTask(taskItem);
    }

    public async Task DeleteTask(string taskId, bool isAdmin)
    {
        if (!isAdmin)
        {
            throw new UnauthorizedAccessException("Only admin can delete tasks permanently");
        }

        await _taskRepository.DeleteTask(taskId);
    }
}