using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TortiYaManager.Infrastructure;
using TortiYaManager.Infrastructure.Auth;

namespace TortiYaManager.WebAPI;

internal static class DatabaseMigrations
{
    public static void ApplyMigrations(this WebApplication app)
    {
        // AppDbContext migration
        // No migrations actually, only setup and db seeding
        using var scope = app.Services.CreateScope();
        var appDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Console.WriteLine($"Checking database for {nameof(ApplicationDbContext)}");
        if (appDbContext.Database.EnsureCreated())
        {
            Console.WriteLine($"Database for {nameof(ApplicationDbContext)} created, seeding initial data...");
            SeedData.InitializeDatabase(appDbContext);
            Console.WriteLine("Database for {nameof(ApplicationDbContext)} seeded successfully.");
        }
        else
        {
            Console.WriteLine($"Database for {nameof(ApplicationDbContext)} already exists, skipping setup and seeding.");
        }

        // AuthDbContext migration
        Console.WriteLine($"Checking database for {nameof(AuthDbContext)}");
        var authDbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        Console.WriteLine($"Applying migrations for {nameof(AuthDbContext)}");
        try
        {
            authDbContext.Database.Migrate();
            Console.WriteLine($"Migrations for {nameof(AuthDbContext)} applied successfully.");
        }
        catch (Exception e)
        {
            Console.Error.WriteLine($"Failed to apply migrations for {nameof(AuthDbContext)}: {e.Message}. Please check the database connection and configuration.");
            throw;
        }
    }
}