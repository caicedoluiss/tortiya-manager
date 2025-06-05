using System;
using System.Collections.Generic;

namespace TortiYaManager.Core.Sales;

public class Order : DbEntityBase
{
    public DateTime Date { get; set; }
    public string? PaymentMethod { get; set; }
    public List<OrderItem> Items { get; set; } = [];
}

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal? Charge { get; set; }
    public decimal Cost { get; set; }
}