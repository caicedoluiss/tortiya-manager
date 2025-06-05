using SharedLib.CQRS;
using TortiYaManager.Application.Sales.Repositories;

namespace TortiYaManager.Application.Sales.Queries;

public class GetPaymentMethodsQuery
{
    public record QueryArgs();
    public record QueryResult(IEnumerable<string> PaymentMethods);

    public class Handler(IPaymentMethodsRepository repository) : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override async Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            var result = await repository.GetAllAsync(cancellationToken: cancellationToken);
            return new QueryResult(result.Select(x => x.Name));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IEnumerable<(string, string)>>([]);
        }
    }
}