using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TortiYaManager.Application.Sales.Repositories;
using TortiYaManager.Infrastructure.Auth;
using TortiYaManager.Infrastructure.Repositories.Sales;

namespace TortiYaManager.Infrastructure;

public static class InfrastructureServices
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfigurationManager configurationManager)
    {
        AddAuthServices(services, configurationManager);

        CosmosDbSettings cosmosConfig = configurationManager.GetSection(CosmosDbSettings.Position).Get<CosmosDbSettings>() ?? new();
        services.AddDbContext<ApplicationDbContext>(config => config.UseCosmos(cosmosConfig.AccountEndpoint, cosmosConfig.AccountKey, cosmosConfig.DbName));

        AddRepositories(services);
    }

    private static void AddRepositories(IServiceCollection services)
    {
        services.AddScoped<IPaymentMethodsRepository, PaymentMethodsRepository>();
        services.AddScoped<IProductsRepository, ProductsRepository>();
        services.AddScoped<IOrdersRepository, OrdersRepository>();
    }

    private static void AddAuthServices(IServiceCollection services, IConfigurationManager configurationManager)
    {
        services.AddDbContext<AuthDbContext>(config => config.UseSqlServer(configurationManager.GetConnectionString("SqlDb")));
    }
}