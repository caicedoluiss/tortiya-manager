using TortiYaManager.Core.Sales;

namespace TortiYaManager.Application.Sales.DTOs;

public record OrderDto
{
    public string Id { get; set; } = string.Empty;
    /// <summary>
    /// In ISO8601 compliant format. See Constants.DATE_TIME_FORMAT.
    /// </summary>
    public string Date { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public IEnumerable<OrderItemDto> Items { get; set; } = [];

    public static OrderDto FromCore(Order order) => new()
    {
        Id = order.Id,
        Date = order.Date.ToString(Constants.DATE_TIME_FORMAT),
        PaymentMethod = order.PaymentMethod,
        Items = order.Items.Select(OrderItemDto.FromCore)
    };
}

public record NewOrderDto
{
    /// <summary>
    /// ISO 8601 compliant format. . See Constants.DATE_TIME_FORMAT.
    /// </summary>
    public string ClientDate { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public IEnumerable<NewOrderItemDto> Items { get; set; } = [];

    public Order ToCore() => new()
    {
        Date = Utils.ParseIso8601DateTimeString(ClientDate).UtcDateTime,
        PaymentMethod = Items.Any(x => x.Charge is not null) ? PaymentMethod : null,
        Items = Items.Select(x => x.ToCore()).ToList()
    };
}

public class OrderItemDto : NewOrderItemDto
{
    public string Id { get; set; } = string.Empty;

    public static OrderItemDto FromCore(OrderItem orderItem) => new()
    {
        Id = orderItem.Id,
        Name = orderItem.Name,
        Quantity = orderItem.Quantity,
        Cost = orderItem.Cost,
        Charge = orderItem.Charge
    };
}

public class NewOrderItemDto
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal? Charge { get; set; }
    public decimal Cost { get; set; }

    public OrderItem ToCore() => new()
    {
        Name = Name,
        Quantity = Quantity,
        Cost = Cost,
        Charge = Charge
    };
}