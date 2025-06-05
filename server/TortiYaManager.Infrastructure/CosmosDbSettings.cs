namespace TortiYaManager.Infrastructure;

public class CosmosDbSettings
{
    public static readonly string Position = "CosmosDbSettings";

    public string DbName { get; set; } = "none";
    public string AccountEndpoint { get; set; } = "none";
    public string AccountKey { get; set; } = "none";
}