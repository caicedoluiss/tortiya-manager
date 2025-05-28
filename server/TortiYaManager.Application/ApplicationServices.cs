using Microsoft.Extensions.DependencyInjection;
using SharedLib.CQRS;
using TortiYaManager.Application.Sales.Queries;

namespace TortiYaManager.Application;

public static class ApplicationServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register the AppRequestsMediator
        services.AddScoped<IAppRequestsMediator, AppRequestsMediator>();
        AddQueries(services);

        return services;
    }

    private static void AddQueries(IServiceCollection services)
    {
        services.AddScoped<IAppRequestHandler<GetProductsQuery.QueryArgs, GetProductsQuery.QueryResult>, GetProductsQuery.Handler>();
        services.AddScoped<IAppRequestHandler<GetOrdersQuery.QueryArgs, GetOrdersQuery.QueryResult>, GetOrdersQuery.Handler>();
    }
}