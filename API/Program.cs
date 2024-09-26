using API.Configuration;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Security.Claims;
using Keycloak.AuthServices.Common;
using Keycloak.AuthServices.Authentication;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(
    options => {
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory,
        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "Hotel API", Version = "v1" });
        var keycloakOptions = builder.Configuration.GetKeycloakOptions<KeycloakAuthenticationOptions>()!;

        options.AddSecurityDefinition(
            "oidc",
            new OpenApiSecurityScheme
            {
                Name = "oauth2",
                Type = SecuritySchemeType.OpenIdConnect,
                OpenIdConnectUrl = new Uri(keycloakOptions.OpenIdConnectUrl!)
            }
        );

        options.AddSecurityRequirement(
            new OpenApiSecurityRequirement
            {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "oidc"
                    }
                },
                Array.Empty<string>()
            }
            }
        );
    });

// Activate this to insert dummy data
// builder.Services.AddTransient<RoomInitializationService>(); // insert dummy data

builder.AddNpgsqlDbContext<ApplicationDBContext>("hoteldb");

builder.Services.AddControllers();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();

// Add JWT Authentication
/*builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.Audience = builder.Configuration["AppSettings:Audience"];
        options.MetadataAddress = builder.Configuration["AppSettings:MetaDataAddress"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["AppSettings:ValidIssuer"]
        };
    });
*/

//builder.Services.AddAuthentication().AddKeycloakJwtBearer("keycloak", "hotel");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

builder.Services.AddKeycloakWebApiAuthentication(
    builder.Configuration,
    options =>
    {
        options.Audience = builder.Configuration["AppSettings:Audience"];
        options.RequireHttpsMetadata = false;
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add dummy data
// Activate this to insert dummy data
/*
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<RoomInitializationService>();
    initializer.InitializeRooms();
}
*/

// Handle migration and ensure the database is up to date
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
    try
    {
        context.Database.Migrate(); // Apply pending migrations
    }
    catch (Exception ex)
    {
        // Log or handle the exception as needed
        Console.WriteLine($"Migration failed: {ex.Message}");
        // Optionally, log this error using a logging framework like Serilog or NLog
    }
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.MapGet("user/me", (ClaimsPrincipal claimsprincipal) =>
{
    return claimsprincipal.Claims.ToDictionary(c => c.Type, c => c.Value);
}).RequireAuthorization();

// Add these lines
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
