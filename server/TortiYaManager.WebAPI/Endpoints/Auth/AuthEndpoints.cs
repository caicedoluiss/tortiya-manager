using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TortiYaManager.Application.Auth;
using TortiYaManager.Core.Auth;
using TortiYaManager.Infrastructure.Auth;

namespace TortiYaManager.WebAPI.Endpoints.Auth;

public sealed class AuthEndpoints : IEndpoint
{
    public record RegisterRequest(string FirstName, string LastName, string Email, string Password, AppUserRole UserRole);
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string Jwt);

    public static void Map(IEndpointRouteBuilder app, string? prefix = null)
    {
        var basePath = WebAPIUtils.BuildEndpointRoute(prefix, "auth");
        app.MapPost($"{basePath}/register", Register)
            .WithName(nameof(Register))
            .WithTags("Auth")
            .Accepts<RegisterRequest>(MediaTypeNames.Application.Json)
            .Produces(StatusCodes.Status201Created)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError)
            .AllowAnonymous();

        app.MapPost($"{basePath}/login", Login)
            .WithName(nameof(Login))
            .WithTags("Auth")
            .Accepts<LoginRequest>(MediaTypeNames.Application.Json)
            .Produces<LoginResponse>(StatusCodes.Status200OK, MediaTypeNames.Application.Json)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError)
            .AllowAnonymous();
    }

    private static async Task<IResult> Register([FromServices] IAuthManagerService authManagerService, [FromBody] RegisterRequest request)
    {
        var userInfo = new AppUser(request.FirstName, request.LastName, request.Email);
        var result = await authManagerService.RegisterAsync(userInfo, request.Password, request.UserRole);
        return result is not null ?
            Results.BadRequest(new ErrorResponse([result.Value])) :
            Results.Created();
    }

    private static async Task<IResult> Login([FromServices] IAuthManagerService authManagerService, [FromBody] LoginRequest request)
    {
        var jwt = await authManagerService.LoginAsync(request.Email, request.Password);
        return jwt is not null ?
            Results.Ok(new LoginResponse(jwt)) :
            Results.BadRequest(new ErrorResponse([("credentials", "Invalid email or password.")]));
    }
}