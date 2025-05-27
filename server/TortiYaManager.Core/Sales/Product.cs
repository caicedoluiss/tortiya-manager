using System;

namespace TortiYaManager.Core.Sales;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public decimal Price { get; set; }
}