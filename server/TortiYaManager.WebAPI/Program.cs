using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TortiYaManager.WebAPI;
using TortiYaManager.Application;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

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

        builder.Services.AddApplicationServices();

        builder.Services.AddEndpointsApiExplorer();

        bool isDebugLocalOrDevEnv = builder.Environment.IsDebug() || builder.Environment.IsLocal() || builder.Environment.IsDevelopment();
        if (isDebugLocalOrDevEnv)
        {
            builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "TortiYaManager API", Version = "v1" });
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

        string prefix = "api/v1/";
        app.MapEndpoints(prefix);

        app.Run();
    }
}