using Microsoft.EntityFrameworkCore;
using TortiYaManager.Core.Sales;

namespace TortiYaManager.Infrastructure;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PaymentMethod>(config =>
        {
            config.ToContainer(nameof(PaymentMethods));
            config.HasKey(x => x.Id);
            config.HasPartitionKey(x => x.Id);
        });

        modelBuilder.Entity<Product>(config =>
        {
            config.ToContainer(nameof(Products));
            config.HasKey(x => x.Id);
            config.HasPartitionKey(x => x.Id);
        });

        modelBuilder.Entity<Order>(config =>
        {
            config.ToContainer(nameof(Orders));
            config.HasKey(x => x.Id);
            config.HasPartitionKey(x => x.Id);
            config.OwnsMany(x => x.Items);
        });
    }
}