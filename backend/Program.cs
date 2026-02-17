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
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
        });

        var app = builder.Build();

        app.UseCors("AllowClient");

        app.MapGet("/Auth", (string username, string password) => commands.Authorization(username, password));
        app.MapGet("/Reg", (string username, string password) => commands.Registration(username, password));
        app.MapGet("/LoadData", (string username)=> commands.LoadData(username));
        app.MapPost("/AddData",(string username, DataObject item) => commands.AddItem(username, item));
        app.Run();
    }
}