using System;
using System.Collections.Generic;

namespace TortiYaManager.Core.Sales;

public class Orders
{
    public DateTime Date { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public IEnumerable<OrderItem>? Items { get; set; }
    public bool NoCharge { get; set; }
}

public class OrderItem
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public bool NoCharge { get; set; }
}