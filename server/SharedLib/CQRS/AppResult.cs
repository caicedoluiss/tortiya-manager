using System.Collections.Generic;
using System.Linq;

namespace SharedLib.CQRS;

public interface IAppResultBase
{
    bool IsSuccess { get; }
    public IEnumerable<(string field, string error)> ValidationErrors { get; }
    string Message { get; }
}

public interface IAppResult<out TValue> : IAppResultBase
{
    TValue? Value { get; }
}


public record AppResultBase : IAppResultBase
{
    public bool IsSuccess { get; }
    public IEnumerable<(string field, string error)> ValidationErrors { get; } = [];
    public string Message { get; init; } = string.Empty;

    public AppResultBase(bool isSuccess = false)
    {
        IsSuccess = isSuccess;
        Message = isSuccess ? string.Empty : "Application request error result.";
    }

    public AppResultBase(IEnumerable<(string field, string error)> validationErrors)
    {
        IsSuccess = validationErrors == null || !validationErrors.Any();
        Message = IsSuccess ? string.Empty : "There are some validation errors.";
        ValidationErrors = validationErrors ?? [];
    }
}

public record AppResult<TValue> : AppResultBase, IAppResult<TValue>
{
    public TValue? Value { get; }

    public AppResult() : base(false)
    {
        Value = default;
    }

    public AppResult(IEnumerable<(string field, string error)> validationErrors) : base(validationErrors)
    {
        Value = default;
    }

    public AppResult(TValue value) : base(true)
    {
        Value = value;
    }
}