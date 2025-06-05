using Microsoft.EntityFrameworkCore;
using TortiYaManager.Application.Sales.Repositories;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure.Repositories.Sales;

public sealed class PaymentMethodsRepository(ApplicationDbContext context) : IPaymentMethodsRepository
{
    public async Task<IReadOnlyCollection<PaymentMethod>> GetAllAsync(bool track = false, CancellationToken cancellationToken = default)
    {
        var query = context.PaymentMethods.AsQueryable();

        if (!track) query = query.AsNoTracking();

        var result = (await query.ToListAsync(cancellationToken)).AsReadOnly();

        return result;
    }
}