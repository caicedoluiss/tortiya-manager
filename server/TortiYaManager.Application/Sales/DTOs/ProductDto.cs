namespace TortiYaManager.Application.Sales.DTOs;

public record ProductDto(
    string Id,
    string Name,
    decimal Cost,
    decimal Price
)
{
    public static ProductDto FromCore(Core.Sales.Product product) =>
        new(product.Id, product.Name, product.Cost, product.Price);

    public Core.Sales.Product ToCore() =>
        new()
        {
            Id = Id,
            Name = Name,
            Cost = Cost,
            Price = Price
        };
}