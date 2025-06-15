using TortiYaManager.Core.Sales;

namespace TortiYaManager.Application.Sales.Repositories;

public interface IOrdersRepository
{
    Task<IReadOnlyCollection<Order>> GetByDateAsync(DateTimeOffset clientDate, bool track = false, CancellationToken cancellationToken = default);
    Order Create(Order order);
}