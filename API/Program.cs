using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))); //add connection

builder.Services.AddCors(
    options => { options.AddPolicy("AllowReactApp", 
        builder => { builder.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader(); 
        }); 
    }
);

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowReactApp");



// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
