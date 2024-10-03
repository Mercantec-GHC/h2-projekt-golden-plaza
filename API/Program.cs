using System.Reflection;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using API.Configuration;
using API.Data;
using API.Services;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Common;

var builder = WebApplication.CreateBuilder(args);

#region Configure Services

// Add controllers to the services container
builder.Services.AddControllers();

// Configure the PostgreSQL database context
// Replace "hoteldb" with your actual connection string name
builder.AddNpgsqlDbContext<ApplicationDBContext>("hoteldb");

// Configure Keycloak authentication
builder.Services.AddKeycloakWebApiAuthentication(
    builder.Configuration,
    options =>
    {
        options.Audience = builder.Configuration["AppSettings:Audience"];
        options.RequireHttpsMetadata = false;
    });

// Add authorization services
builder.Services.AddAuthorization();

// Configure mail service settings
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();

// Configure CORS to allow any origin, method, and header
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policyBuilder =>
        {
            policyBuilder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
        });
});

// Configure Swagger/OpenAPI documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Include XML comments for better documentation in Swagger
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory,
        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));

    // Basic information for Swagger UI
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Hotel API", Version = "v1" });

    // Configure Swagger to use Keycloak authentication
    var keycloakOptions = builder.Configuration.GetKeycloakOptions<KeycloakAuthenticationOptions>()!;

    options.AddSecurityDefinition(
        "oidc",
        new OpenApiSecurityScheme
        {
            Name = "oauth2",
            Type = SecuritySchemeType.OpenIdConnect,
            OpenIdConnectUrl = new Uri(keycloakOptions.OpenIdConnectUrl!)
        });

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
        });
});

#endregion

var app = builder.Build();

#region Configure Middleware

// Enable Swagger UI in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply database migrations and ensure the database is up to date
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
    context.Database.EnsureCreated(); // Ensure the database is created

    try
    {
        context.Database.Migrate(); // Apply pending migrations
    }
    catch (Exception ex)
    {
        // Log or handle the exception as needed
        Console.WriteLine($"Migration failed: {ex.Message}");
        // Optionally, use a logging framework like Serilog or NLog
    }
}

// Use the defined CORS policy
app.UseCors("AllowAll");

// Redirect HTTP requests to HTTPS
app.UseHttpsRedirection();

// Enable authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controllers to endpoints
app.MapControllers();

// Define an endpoint to retrieve user claims (requires authentication)
app.MapGet("user/me", (ClaimsPrincipal claimsPrincipal) =>
{
    // Return the user's claims as a dictionary
    return claimsPrincipal.Claims.ToDictionary(c => c.Type, c => c.Value);
}).RequireAuthorization();

#endregion

app.Run();
