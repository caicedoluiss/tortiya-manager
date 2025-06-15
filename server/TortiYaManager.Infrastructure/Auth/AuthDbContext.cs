using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TortiYaManager.Infrastructure.Auth;

public class AuthDbContext(DbContextOptions<AuthDbContext> options) : IdentityDbContext<AppUser, AppRole, Guid>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(config =>
        {
            config.ToTable("AppUsers");
        });

        builder.Entity<AppRole>(config =>
        {
            config.ToTable("AppRoles");
        });
    }
}