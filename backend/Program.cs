namespace backend;

public class Program
{
    public static void Main()
    {
        var commands = new Commands();
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowClient", policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
        });

        var app = builder.Build();

        app.UseCors("AllowClient");

        app.MapGet("/Auth", (string username, string password) => commands.Authorization(username, password));
        app.MapGet("/Profile", (string username) => commands.LoadUserData(username));
        
        app.Run();
    }
}