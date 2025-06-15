using Microsoft.Extensions.DependencyInjection;
using SharedLib.CQRS;
using TortiYaManager.Application.Auth;
using TortiYaManager.Application.Sales.Commands;
using TortiYaManager.Application.Sales.Queries;

namespace TortiYaManager.Application;

public static class ApplicationServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        AddAuthServices(services);

        // Register the AppRequestsMediator
        services.AddScoped<IAppRequestsMediator, AppRequestsMediator>();
        // Register App Queries and Commands
        AddQueries(services);
        AddCommands(services);

        return services;
    }

    private static void AddQueries(IServiceCollection services)
    {
        services.AddScoped<IAppRequestHandler<GetPaymentMethodsQuery.QueryArgs, GetPaymentMethodsQuery.QueryResult>, GetPaymentMethodsQuery.Handler>();
        services.AddScoped<IAppRequestHandler<GetProductsQuery.QueryArgs, GetProductsQuery.QueryResult>, GetProductsQuery.Handler>();
        services.AddScoped<IAppRequestHandler<GetOrdersByDateQuery.QueryArgs, GetOrdersByDateQuery.QueryResult>, GetOrdersByDateQuery.Handler>();
    }

    private static void AddCommands(IServiceCollection services)
    {
        services.AddScoped<IAppRequestHandler<CreateOrderCommand.CommandArgs, CreateOrderCommand.CommandResult>, CreateOrderCommand.Handler>();
    }

    private static void AddAuthServices(IServiceCollection services)
    {
        services.AddSingleton<IEmailValidator, EmailValidator>();
    }
}