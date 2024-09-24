using API.Configuration;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Activate this to insert dummy data
// builder.Services.AddTransient<RoomInitializationService>(); // insert dummy data

builder.AddNpgsqlDbContext<ApplicationDBContext>("hoteldb");

builder.Services.AddControllers();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

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

// Add these lines
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
