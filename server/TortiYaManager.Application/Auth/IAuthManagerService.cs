using TortiYaManager.Core.Auth;

namespace TortiYaManager.Application.Auth;

public interface IAuthManagerService
{
    Task<(string field, string error)?> RegisterAsync(IAppUser user, string password, AppUserRole role);
    Task<string?> LoginAsync(string userName, string password);
}