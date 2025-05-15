// UserService.cs
using API.DTOs;
using API.Helpers;
using API.Models;
using API.Repositories;
using BCrypt.Net;
using System.Security.Cryptography;
using System.Text;

namespace API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly JwtHelper _jwt;

    public UserService(IUserRepository repo, JwtHelper jwt)
    {
        _repo = repo;
        _jwt = jwt;
    }

    public async Task<UserDto?> RegisterAsync(RegisterDto dto)
    {
        var exists = await _repo.GetByEmailAsync(dto.email);
        if (exists != null) return null;

        var user = new User
        {
            name = dto.name,
            email = dto.email,
            password = Hash(dto.password),
            role = "user"
        };

        await _repo.CreateAsync(user);
        return new UserDto
        {
            Id = user.Id,
            name = user.name,
            email = user.email,
            role = user.role,
            isActive = user.isActive,
            token = _jwt.GenerateToken(user)
        };
    }

    public async Task<UserDto?> LoginAsync(LoginDto dto)
    {
        var user = await _repo.GetByEmailAsync(dto.email);
        if (user == null || !Verify(dto.password, user.password) || !user.isActive) return null;

        return new UserDto
        {
            Id = user.Id,
            name = user.name,
            email = user.email,
            role = user.role,
            isActive = user.isActive,
            token = _jwt.GenerateToken(user)
        };
    }

    public async Task<(List<UserDto> Users, long TotalCount)> GetAllAsync(QueryParametersDto queryParameters)
    {
        var (users, totalCount) = await _repo.GetAllAsync(queryParameters);
        
        var userDtos = users.Select(u => new UserDto
        {
            Id = u.Id,
            name = u.name,
            email = u.email,
            role = u.role,
            isActive = u.isActive
        }).ToList();
        
        return (userDtos, totalCount);
    }

    

    public async Task<bool> UpdateUserAsync(string id, UpdateUserDto dto)
    {
        var user = await _repo.GetByIdAsync(id);
        if (user == null) return false;
    
        await _repo.UpdateFieldsAsync(id, dto.name, dto.email, dto.role, dto.isActive);
        return true;
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var user = await _repo.GetByIdAsync(id);
        if (user == null) return false;

        return await _repo.DeleteAsync(id);
    }

    private string Hash(string input) => BCrypt.Net.BCrypt.HashPassword(input);
    
    private bool Verify(string input, string hash) => BCrypt.Net.BCrypt.Verify(input, hash);

}
