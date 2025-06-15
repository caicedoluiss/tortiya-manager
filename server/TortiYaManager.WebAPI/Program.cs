using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TortiYaManager.WebAPI;
using TortiYaManager.Application;
using TortiYaManager.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;
using TortiYaManager.Application.Auth;
using TortiYaManager.WebAPI.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using TortiYaManager.Infrastructure.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.WebHost.ConfigureKestrel(options =>
        {
            options.AddServerHeader = false;
        });
        builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
        {
            options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        });

        AddIdentityJwtBearerAuthServices(builder.Services, builder.Configuration);
        builder.Services.AddApplicationServices();
        builder.Services.AddInfrastructureServices(builder.Configuration);

        builder.Services.AddEndpointsApiExplorer();

        bool isDebugLocalOrDevEnv = builder.Environment.IsDebug() || builder.Environment.IsLocal() || builder.Environment.IsDevelopment();
        if (isDebugLocalOrDevEnv)
        {
            builder.Services.AddSwaggerGen(config =>
            {
                config.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    BearerFormat = "JWT"
                });
                config.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = JwtBearerDefaults.AuthenticationScheme
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "TortiYaManager API", Version = "v1" });
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder => builder.AllowAnyOrigin()
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });
        }

        var app = builder.Build();

        if (args.Contains("migrate"))
        {
            DatabaseMigrations.ApplyMigrations(app);
            return;
        }

        if (isDebugLocalOrDevEnv)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "TortiYaManager API v1");
                c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
            });
            app.UseDeveloperExceptionPage();

            app.UseCors("AllowAllOrigins");
        }

        app.UseAuthentication();
        app.UseAuthorization();

        string prefix = "api/v1/";
        app.MapEndpoints(prefix);

        app.Run();
    }

    private static void AddIdentityJwtBearerAuthServices(IServiceCollection services, IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection(JwtSettings.Position);
        var jwtSettings = jwtSection.Get<JwtSettings>();
        if (jwtSettings is null || string.IsNullOrEmpty(jwtSettings.Issuer?.Trim()) ||
            string.IsNullOrEmpty(jwtSettings.Audience?.Trim()) || string.IsNullOrEmpty(jwtSettings.Secret?.Trim()))
        {
            throw new InvalidOperationException("JWT settings are not properly configured.");
        }
        services.Configure<JwtSettings>(jwtSection);

        // Identity
        services.AddIdentityCore<AppUser>(options =>
        {
            options.Password.RequiredLength = 4;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;

            options.User.RequireUniqueEmail = true;
        })
        .AddRoles<AppRole>()
        .AddEntityFrameworkStores<AuthDbContext>()
        .AddDefaultTokenProviders();

        // Jwt Bearer Authentication
        var tokenValidationParameters = new TokenValidationParameters()
        {
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
            ValidAlgorithms = [SecurityAlgorithms.HmacSha256Signature],

            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            RequireAudience = true,
            RequireExpirationTime = true,
            RequireSignedTokens = true,
        };

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme =
            options.DefaultChallengeScheme =
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = tokenValidationParameters;
            options.ClaimsIssuer = jwtSettings.Issuer;
            options.SaveToken = false;
            options.IncludeErrorDetails = false;
            options.MapInboundClaims = false;
        });
        services.AddAuthorization();
        services.AddScoped<JsonWebTokenHandler>();
        services.AddScoped<IAuthManagerService, AuthManagerService>();
    }
}