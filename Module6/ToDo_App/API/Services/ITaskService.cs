using API.DTOs;
using API.Models;

namespace API.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetTasks(string projectId, string userId, bool isAdmin);
    Task<TaskItem> GetTask(string taskId);
    Task<TaskItem> CreateTask(CreateTaskDto taskDto, string projectId, string userId);
    Task<TaskItem> UpdateTask(string taskId, UpdateTaskDto taskDto, string userId, bool isAdmin);
    Task DeleteTask(string taskId, bool isAdmin);
}