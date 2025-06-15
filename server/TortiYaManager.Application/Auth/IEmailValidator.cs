namespace TortiYaManager.Application.Auth;

public interface IEmailValidator
{
    bool IsValid(string? email);
}