using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;
using TortiYaManager.Application.Sales.Repositories;

namespace TortiYaManager.Application.Sales.Queries;

public class GetOrdersByDateQuery
{
    public record QueryArgs(string ClientDate);
    public record QueryResult(IEnumerable<OrderDto> Orders);

    public class Handler(IOrdersRepository respository) : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override async Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            var clientDate = Utils.ParseIso8601DateTimeString(args.ClientDate);
            var result = await respository.GetByDateAsync(clientDate, cancellationToken: cancellationToken);

            return new(result.Select(x => OrderDto.FromCore(x)));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            List<(string, string)> errors = [];

            if (!Utils.IsIso8601DateStringValid(args.ClientDate))
                errors.Add(("clientDate", "Invalid value."));

            return Task.FromResult<IEnumerable<(string, string)>>(errors);
        }
    }
}