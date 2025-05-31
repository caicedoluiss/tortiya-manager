using System.Collections.Generic;
using System.Linq;

namespace TortiYaManager.WebAPI;

public record FieldValidationError(string Field, IEnumerable<string> Errors);

public record ErrorResponse
{
    public int StatusCode { get; }
    public string Message { get; init; } = string.Empty;
    public IEnumerable<FieldValidationError> ValidationErrors { get; } = [];

    public ErrorResponse(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }

    public ErrorResponse(IEnumerable<(string field, string error)> validationErrors)
        : this(400, "There are validation errors.")
    {
        ValidationErrors = validationErrors.GroupBy(e => e.field, x => x.error, (name, errors) => new FieldValidationError(name, errors));
    }
}