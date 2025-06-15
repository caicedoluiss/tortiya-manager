using Microsoft.EntityFrameworkCore;
using TortiYaManager.Application.Sales.Repositories;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure.Repositories.Sales;

public sealed class OrdersRepository(ApplicationDbContext context) : IOrdersRepository
{
    public Order Create(Order order)
    {
        var result = context.Orders.Add(order).Entity;
        context.SaveChanges();
        return result;
    }

    public async Task<IReadOnlyCollection<Order>> GetByDateAsync(DateTimeOffset clientDate, bool track = false, CancellationToken cancellationToken = default)
    {
        // Get Utc DateTime from Client Date (DateTimeOffset) at 12AM from day.
        // In this case a new instance was required as Date property doesn't store offset information for converting to Utc later
        var clientDateUtc = new DateTimeOffset(clientDate.Date, clientDate.Offset).UtcDateTime;
        var nextDateUtc = clientDateUtc.AddDays(1);

        var query = context.Orders.AsQueryable();
        if (!track) query = query.AsNoTracking();

        query = query.Where(o => o.Date >= clientDateUtc && o.Date < nextDateUtc);
        var result = await query.ToListAsync(cancellationToken);

        return result.AsReadOnly();
    }
}