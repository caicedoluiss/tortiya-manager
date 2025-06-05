using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;
using TortiYaManager.Application.Sales.Repositories;

namespace TortiYaManager.Application.Sales.Queries;

public class GetProductsQuery
{
    public record QueryArgs();
    public record QueryResult(IEnumerable<ProductDto> Products);

    public class Handler(IProductsRepository repository) : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override async Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            var result = await repository.GetAllAsync(cancellationToken: cancellationToken);
            var productDtos = result.Select(x => ProductDto.FromCore(x));

            return new(productDtos);
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(Enumerable.Empty<(string field, string error)>());
        }
    }
}