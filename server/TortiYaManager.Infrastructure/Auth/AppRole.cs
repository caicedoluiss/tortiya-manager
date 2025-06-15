using Microsoft.AspNetCore.Identity;

namespace TortiYaManager.Infrastructure.Auth;

public class AppRole : IdentityRole<Guid>
{
    public const string Owner = "Owner";
    public const string User = "User";

    public AppRole()
    {
        ConcurrencyStamp = Guid.NewGuid().ToString();
    }
}