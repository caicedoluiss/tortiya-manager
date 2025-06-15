namespace TortiYaManager.Application.Auth;

public sealed class EmailValidator : IEmailValidator
{
    public bool IsValid(string? email)
    {
        if (string.IsNullOrEmpty(email?.Trim()) || email.EndsWith('.')) return false;

        try
        {
            // Use System.Net.Mail for robust email validation
            var addr = new System.Net.Mail.MailAddress(email!);
            // Ensure address is normalized (e.g., no extra spaces)
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}