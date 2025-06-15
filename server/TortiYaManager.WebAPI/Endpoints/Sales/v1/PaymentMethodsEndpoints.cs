using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using SharedLib.CQRS;
using TortiYaManager.Application.Sales.Queries;

namespace TortiYaManager.WebAPI.Endpoints.Sales.v1;

public sealed class PaymentMethodsEndpoints : IEndpoint
{
    public record GetPaymentMethodsResponse(IEnumerable<string> PaymentMethods);

    public static void Map(IEndpointRouteBuilder app, string? prefix = null)
    {
        string basePath = WebAPIUtils.BuildEndpointRoute(prefix, "payment-methods");
        app.MapGet(basePath, GetPaymentMethods)
            .WithName(nameof(GetPaymentMethods))
            .WithTags("Payment Methods")
            .Produces<GetPaymentMethodsResponse>(StatusCodes.Status200OK, MediaTypeNames.Application.Json)
            .Produces<ErrorResponse>(StatusCodes.Status401Unauthorized)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError, MediaTypeNames.Application.Json)
            .RequireAuthorization();
    }

    private static async Task<IResult> GetPaymentMethods(
        [FromServices] IAppRequestsMediator mediator
    )
    {
        var appRequest = new AppRequest<GetPaymentMethodsQuery.QueryArgs>(new());
        var appResult = await mediator
            .SendAsync<GetPaymentMethodsQuery.QueryArgs, GetPaymentMethodsQuery.QueryResult>(appRequest);

        return Results.Ok(new GetPaymentMethodsResponse(appResult.Value!.PaymentMethods));
    }
}