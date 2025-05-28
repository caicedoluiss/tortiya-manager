using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;
using TortiYaManager.Application.Sales.Queries;

namespace TortiYaManager.WebAPI.Endpoints.Sales.v1;

public class OrdersEndpoints : IEndpoint
{
    public record GetOrdersResponse(IEnumerable<OrderDto> Orders);

    public static void Map(IEndpointRouteBuilder app, string? prefix = null)
    {
        var basePath = WebAPIUtils.BuildEndpointRoute(prefix, "orders");
        app.MapGet($"{basePath}", GetOrders)
            .WithName("GetOrders")
            .WithTags("Orders")
            .Produces<GetOrdersResponse>(StatusCodes.Status200OK)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError);
    }

    private static async Task<IResult> GetOrders(
        [FromServices] IAppRequestsMediator appRequestsMediator, CancellationToken cancellationToken = default)
    {
        var request = new AppRequest<GetOrdersQuery.QueryArgs>(new());
        var result = await appRequestsMediator
            .SendAsync<GetOrdersQuery.QueryArgs, GetOrdersQuery.QueryResult>(request, cancellationToken);

        return result.IsSuccess ?
            Results.Ok(new GetOrdersResponse(result.Value!.Orders)) :
            Results.BadRequest(new ErrorResponse(result.ValidationErrors));
    }
}