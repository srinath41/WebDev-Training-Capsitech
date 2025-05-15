using API.Data;
using API.Models;
using MongoDB.Driver;

namespace API.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly MongoDbContext _context;

    public ProjectRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Project project)
    {
        await _context.Projects.InsertOneAsync(project);
    }

    public async Task<Project?> GetByIdAsync(string id)
    {
        if (string.IsNullOrEmpty(id) || id.Length != 24) return null;

        var filter = Builders<Project>.Filter.Eq(p => p.Id, id);
        return await _context.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Project>> GetAllAsync()
    {
        return await _context.Projects.Find(_ => true).ToListAsync();
    }

    public async Task<List<Project>> GetByUserAsync(string userId)
    {
        return await _context.Projects
            .Find(p => p.assignedUsers.Contains(userId) && p.isDelete == false)
            .ToListAsync();
    }

    // In ProjectRepository.cs
    public async Task<Project> GetProjectById(string projectId)
    {
        return await _context.Projects.Find(p => p.Id == projectId).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Project project)
    {
        await _context.Projects.ReplaceOneAsync(p => p.Id == project.Id, project);
    }

    public async Task DeleteAsync(string id)
    {
        await _context.Projects.DeleteOneAsync(p => p.Id == id);
    }
}
