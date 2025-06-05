using TortiYaManager.Core.Sales;

namespace TortiYaManager.Application.Sales.Repositories;

public interface IProductsRepository
{
    Task<IReadOnlyCollection<Product>> GetAllAsync(bool track = false, CancellationToken cancellationToken = default);
}