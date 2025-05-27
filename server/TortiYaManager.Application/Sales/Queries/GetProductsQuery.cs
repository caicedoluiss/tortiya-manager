using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;

namespace TortiYaManager.Application.Sales.Queries;

public class GetProductsQuery
{
    public record QueryArgs();
    public record QueryResult(IEnumerable<ProductDto> Products);

    public class Handler : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new QueryResult([
                new ProductDto("1", "Product 1", 10.0m, 100),
                new ProductDto("2", "Product 2", 20.0m, 200),
                new ProductDto("3", "Product 3", 30.0m, 300)
            ]));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(Enumerable.Empty<(string field, string error)>());
        }
    }
}