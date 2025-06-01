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

public class ProductsEndpoints : IEndpoint
{
    public record GetProductsResponse(IEnumerable<ProductDto> Products);


    public static void Map(IEndpointRouteBuilder app, string? prefix = null)
    {
        var basePath = WebAPIUtils.BuildEndpointRoute(prefix, "products");
        app.MapGet($"{basePath}", GetProducts)
            .WithName("GetProducts")
            .WithTags("Products")
            .Produces<GetProductsResponse>(StatusCodes.Status200OK)
            .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError);
    }

    private static async Task<IResult> GetProducts(
        [FromServices] IAppRequestsMediator appRequestsMediator, CancellationToken cancellationToken = default)
    {
        var request = new AppRequest<GetProductsQuery.QueryArgs>(new());
        var result = await appRequestsMediator
            .SendAsync<GetProductsQuery.QueryArgs, GetProductsQuery.QueryResult>(request, cancellationToken);

        return Results.Ok(new GetProductsResponse(result.Value!.Products));
    }
}