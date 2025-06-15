using Microsoft.Azure.Cosmos.Spatial;

namespace TortiYaManager.WebAPI.Auth;

public class JwtSettings
{
    public const string Position = "JwtSettings";

    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public int TtlMinutes { get; set; } = 60;
}