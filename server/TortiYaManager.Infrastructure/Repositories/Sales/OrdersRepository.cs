using Microsoft.EntityFrameworkCore;
using TortiYaManager.Application.Sales.Repositories;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure.Repositories.Sales;

public sealed class OrdersRepository(ApplicationDbContext context) : IOrdersRespository
{
    public Order Create(Order order)
    {
        var result = context.Orders.Add(order).Entity;
        context.SaveChanges();
        return result;
    }

    public async Task<IReadOnlyCollection<Order>> GetByDateAsync(DateTimeOffset clientDate, bool track = false, CancellationToken cancellationToken = default)
    {
        var query = context.Orders.AsQueryable();
        if (!track) query = query.AsNoTracking();
        var clientDateUtc = clientDate.Date.ToUniversalTime();
        var nextDateUtc = clientDateUtc.AddDays(1);

        query = query.Where(o => o.Date >= clientDateUtc && o.Date < nextDateUtc);
        var result = await query.ToListAsync(cancellationToken);

        return result.AsReadOnly();
    }
}