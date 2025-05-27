using System.Linq;

namespace TortiYaManager.WebAPI;

public static class WebAPIUtils
{
    public static string BuildEndpointRoute(params string?[] segments)
    {
        // Filter out null, empty and duplicated segments and join them with a forward slash
        return string.Join("/", segments.Where(segment => !string.IsNullOrEmpty(segment)).Select(x => x!.Trim('/')).Distinct());
    }
}