using Microsoft.AspNetCore.Routing;

namespace TortiYaManager.WebAPI.Endpoints;

public interface IEndpoint
{
    static abstract void Map(IEndpointRouteBuilder app, string? prefix = null);
}