using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SharedLib.CQRS;

public interface IAppRequestHandler<in TRequest, TResult>
{
    Task<IAppResult<TResult>> HandleAsync(IAppRequest<TRequest> request, CancellationToken cancellationToken = default);
}

public interface IAppRequestHandler<in TRequest>
{
    Task<IAppResultBase> HandleAsync(IAppRequest<TRequest> request, CancellationToken cancellationToken = default);
}


public abstract class AppRequestHandler<TArgs, TResult> : IAppRequestHandler<TArgs, TResult>
{
    protected abstract Task<IEnumerable<(string field, string error)>> ValidateAsync(TArgs request, CancellationToken cancellationToken = default);
    protected abstract Task<TResult> ExecuteAsync(TArgs args, CancellationToken cancellationToken = default);

    public async Task<IAppResult<TResult>> HandleAsync(IAppRequest<TArgs> request, CancellationToken cancellationToken = default)
    {
        var validationResult = await ValidateAsync(request.Args, cancellationToken);
        if (validationResult.Any()) return new AppResult<TResult>(validationResult);
        var executionResult = await ExecuteAsync(request.Args, cancellationToken);
        return new AppResult<TResult>(executionResult);
    }
}

public abstract class AppRequestHandler<TArgs> : IAppRequestHandler<TArgs>
{
    protected abstract Task<IEnumerable<(string field, string error)>> ValidateAsync(TArgs args, CancellationToken cancellationToken = default);
    protected abstract Task ExecuteAsync(TArgs args, CancellationToken cancellationToken = default);

    public async Task<IAppResultBase> HandleAsync(IAppRequest<TArgs> request, CancellationToken cancellationToken = default)
    {
        var validationResult = await ValidateAsync(request.Args, cancellationToken);
        if (validationResult.Any()) return new AppResult<IAppResultBase>(validationResult);
        await ExecuteAsync(request.Args, cancellationToken);
        return new AppResultBase(true);
    }
}