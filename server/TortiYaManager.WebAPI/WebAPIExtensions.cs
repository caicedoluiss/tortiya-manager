using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TortiYaManager.WebAPI.Endpoints;

namespace TortiYaManager.WebAPI;

public static class WebAPIExtensions
{
    public static void MapEndpoints(this IEndpointRouteBuilder app, string? prefix = null)
    {
        foreach (var endpoint in typeof(WebAPIExtensions).Assembly.GetTypes()
                     .Where(t => typeof(IEndpoint).IsAssignableFrom(t) && !t.IsAbstract))
        {
            var method = endpoint.GetMethod("Map", System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static);
            method?.Invoke(null, [app, prefix]);
        }
    }

    public static void MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app, string? prefix = null) where TEndpoint : IEndpoint
    {
        TEndpoint.Map(app, prefix);
    }
}