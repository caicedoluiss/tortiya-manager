using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure;

public static class SeedData
{
    private static readonly PaymentMethod[] PaymentMethods =
    [
        new()
        {
            Name = "Efectivo"
        },
        new()
        {
            Name = "Nequi"
        }
    ];

    private static readonly Product[] Products =
    [
        new ()
        {
            Name = "Mi tortilla",
            Cost = 1000,
            Price = 2500,
        }
    ];

    public static void InitializeDatabase(ApplicationDbContext context)
    {
        context.PaymentMethods.AddRange(PaymentMethods);
        context.Products.AddRange(Products);
        context.SaveChanges();
    }
}