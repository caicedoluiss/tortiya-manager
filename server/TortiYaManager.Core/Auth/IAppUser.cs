namespace TortiYaManager.Core.Auth;

public interface IAppUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Email { get; set; } // From IdentityUser
}