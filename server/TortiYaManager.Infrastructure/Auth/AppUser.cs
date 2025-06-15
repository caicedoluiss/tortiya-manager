using Microsoft.AspNetCore.Identity;
using TortiYaManager.Core.Auth;

namespace TortiYaManager.Infrastructure.Auth;

public class AppUser : IdentityUser<Guid>, IAppUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public AppUser(string firstName, string lastName, string email) : this()
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        UserName = email;

    }

    public AppUser() : base()
    {
        SecurityStamp = Guid.NewGuid().ToString();
        ConcurrencyStamp = Guid.NewGuid().ToString();
    }
}