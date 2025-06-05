using TortiYaManager.Core.Sales;

namespace TortiYaManager.Application.Sales.Repositories;

public interface IPaymentMethodsRepository
{
    Task<IReadOnlyCollection<PaymentMethod>> GetAllAsync(bool track = false, CancellationToken cancellationToken = default);
}