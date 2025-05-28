using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Application.Sales.Queries;

public class GetOrdersQuery
{
    public record QueryArgs();
    public record QueryResult(IEnumerable<OrderDto> Orders);

    public class Handler : AppRequestHandler<QueryArgs, QueryResult>
    {
        protected override Task<QueryResult> ExecuteAsync(QueryArgs args, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new QueryResult([
                new OrderDto
                {
                    Id = "1",
                    Date = DateTime.UtcNow,
                    NoCharge = false,
                    PaymentMethod = nameof(PaymentMethod.Cash),
                    Items = [
                        new OrderItemDto { Id = "1", Name = "Product 1", Quantity = 2, Price = 10.0m, Cost = 5.0m },
                        new OrderItemDto { Id = "2", Name = "Product 2", Quantity = 1, Price = 20.0m, Cost = 8.0m },
                    ]
                },
                new OrderDto
                {
                    Id = "2",
                    Date = DateTime.UtcNow.AddDays(-1),
                    NoCharge = true,
                    PaymentMethod = null,
                    Items = [
                        new OrderItemDto { Id = "3", Name = "Product 3", Quantity = 3, Price = 30.0m, Cost = 15.0m },
                    ]
                },
                new OrderDto
                {
                    Id = "3",
                    Date = DateTime.UtcNow,
                    NoCharge = false,
                    PaymentMethod = nameof(PaymentMethod.Cash),
                    Items = [
                        new OrderItemDto { Id = "4", Name = "Product 1", Quantity = 2, Price = 10.0m, Cost = 5.0m },
                        new OrderItemDto { Id = "4", Name = "Product 2", Quantity = 1, Price = 20.0m, Cost = 8.0m, NoCharge = true }
                    ]
                },
            ]));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(QueryArgs request, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(Enumerable.Empty<(string field, string error)>());
        }
    }
}