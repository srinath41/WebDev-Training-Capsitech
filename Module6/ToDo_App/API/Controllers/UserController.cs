using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;
    public UserController(IUserService service) => _service = service;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = await _service.RegisterAsync(dto);
        return user == null ? BadRequest("User already exists") : Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _service.LoginAsync(dto);
        return user == null ? Unauthorized("Invalid credentials") : Ok(user);
    }

    [Authorize(Roles="admin")]
    [HttpGet("all")]
    [Authorize(Roles="admin")]
[HttpGet]
public async Task<IActionResult> GetAll(
    [FromQuery] string? search,
    [FromQuery] string? role,
    [FromQuery] bool? isActive,
    [FromQuery] string? sortBy,
    [FromQuery] bool? sortDescending,
    [FromQuery] int page = 1,
    [FromQuery] int perPage = 10)
{
    var queryParameters = new QueryParametersDto
    {
        Search = search,
        Role = role,
        IsActive = isActive,
        SortBy = sortBy,
        SortDescending = sortDescending,
        Page = page,
        PerPage = perPage
    };

    var (users, totalCount) = await _service.GetAllAsync(queryParameters);
    
    // Calculate total pages
    var totalPages = (int)Math.Ceiling((double)totalCount / perPage);
    
    // Create pagination response
    var response = new
    {
        Data = users,
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

    

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _service.UpdateUserAsync(id, dto);
        if (!updated) return NotFound("User not found");
        return Ok("User updated successfully");
    }


    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _service.DeleteUserAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

}
