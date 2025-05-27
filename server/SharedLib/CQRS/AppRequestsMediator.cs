using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace SharedLib.CQRS;

public interface IAppRequestsMediator
{
    Task<IAppResultBase> SendAsync<TArgs>(IAppRequest<TArgs> request, CancellationToken cancellationToken = default);
    Task<IAppResult<TResult>> SendAsync<TArgs, TResult>(IAppRequest<TArgs> request, CancellationToken cancellationToken = default);
}

public class AppRequestsMediator(IServiceProvider serviceProvider) : IAppRequestsMediator
{
    private readonly IServiceProvider serviceProvider = serviceProvider;

    public Task<IAppResultBase> SendAsync<TArgs>(IAppRequest<TArgs> request, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var handler = scope.ServiceProvider.GetRequiredService<IAppRequestHandler<TArgs>>();
        return handler.HandleAsync(request, cancellationToken);
    }

    public Task<IAppResult<TResult>> SendAsync<TArgs, TResult>(IAppRequest<TArgs> request, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var handler = scope.ServiceProvider.GetRequiredService<IAppRequestHandler<TArgs, TResult>>();
        return handler.HandleAsync(request, cancellationToken);
    }
}