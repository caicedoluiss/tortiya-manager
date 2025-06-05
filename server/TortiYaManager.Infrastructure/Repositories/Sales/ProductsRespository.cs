using Microsoft.EntityFrameworkCore;
using TortiYaManager.Application.Sales.Repositories;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure.Repositories.Sales;

public sealed class ProductsRespository(ApplicationDbContext context) : IProductsRepository
{
    public async Task<IReadOnlyCollection<Product>> GetAllAsync(bool track = false, CancellationToken cancellationToken = default)
    {
        var query = context.Products.AsQueryable();
        if (!track) query = query.AsNoTracking();

        var result = await query.ToListAsync(cancellationToken);
        return result.AsReadOnly();
    }
}