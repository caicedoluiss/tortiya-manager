using SharedLib.CQRS;

namespace TortiYaManager.Application.Sales.Queries;

public class GetPaymentMethodsQuery
{
    public record QueryArgs();
    public record QueryResult(IReadOnlyCollection<string> PaymentMethods);

    public class Handler : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<QueryResult>(new(["Efectivo", "Nequi"]));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IEnumerable<(string, string)>>([]);
        }
    }
}