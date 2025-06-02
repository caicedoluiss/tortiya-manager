using System.Collections.Generic;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using SharedLib.CQRS;
using TortiYaManager.Application.Sales.Commands;
using TortiYaManager.Application.Sales.DTOs;
using TortiYaManager.Application.Sales.Queries;

namespace TortiYaManager.WebAPI.Endpoints.Sales.v1;

public class OrdersEndpoints : IEndpoint
{
    #region Requests models

    public record CreateOrderRequest(NewOrderDto Order);

    #endregion

    #region Responses models

    public record GetOrdersResponse(IEnumerable<OrderDto> Orders);
    public record CreateOrderResponse(OrderDto Order);

    #endregion

    public static void Map(IEndpointRouteBuilder app, string? prefix = null)
    {
        var basePath = WebAPIUtils.BuildEndpointRoute(prefix, "orders");
        app.MapGet($"{basePath}/{{clientDate}}", GetOrdersByDate)
            .WithName("GetOrders")
            .WithTags("Orders")
            .Produces<GetOrdersResponse>(StatusCodes.Status200OK, MediaTypeNames.Application.Json)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError, MediaTypeNames.Application.Json);

        app.MapPost($"{basePath}", CreateOrder)
            .WithName("CreateOrder")
            .WithTags("Orders")
            .Accepts<CreateOrderRequest>(MediaTypeNames.Application.Json)
            .Produces<CreateOrderResponse>(StatusCodes.Status201Created, MediaTypeNames.Application.Json)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest, MediaTypeNames.Application.Json)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError, MediaTypeNames.Application.Json);
    }

    private static async Task<IResult> GetOrdersByDate(
        [FromRoute] string clientDate,
        [FromServices] IAppRequestsMediator appRequestsMediator,
        CancellationToken cancellationToken = default)
    {
        var appRequest = new AppRequest<GetOrdersByDateQuery.QueryArgs>(new(clientDate));
        var appResult = await appRequestsMediator
            .SendAsync<GetOrdersByDateQuery.QueryArgs, GetOrdersByDateQuery.QueryResult>(appRequest, cancellationToken);

        return appResult.IsSuccess ?
            Results.Ok(new GetOrdersResponse(appResult.Value!.Orders)) :
            Results.BadRequest(new ErrorResponse(appResult.ValidationErrors));
    }

    private static async Task<IResult> CreateOrder(
        [FromBody] CreateOrderRequest request,
        [FromServices] IAppRequestsMediator appRequestsMediator,
        CancellationToken cancellationToken = default)
    {
        var appRequest = new AppRequest<CreateOrderCommand.CommandArgs>(new(request.Order));
        var appResult = await appRequestsMediator
            .SendAsync<CreateOrderCommand.CommandArgs, CreateOrderCommand.CommandResult>(appRequest, cancellationToken);

        return appResult.IsSuccess ?
            Results.Json(new CreateOrderResponse(appResult.Value!.Order), statusCode: StatusCodes.Status201Created) :
            Results.BadRequest(new ErrorResponse(appResult.ValidationErrors));
    }
}