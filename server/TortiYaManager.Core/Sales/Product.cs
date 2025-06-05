using System;

namespace TortiYaManager.Core.Sales;

public class Product : DbEntityBase
{
    public string Name { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public decimal Price { get; set; }
}