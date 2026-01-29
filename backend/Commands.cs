using System.Data;
using MySql.Data.MySqlClient;

namespace backend;
public class Commands
{
    DataBase dataBase = new DataBase();
    public bool Authorization(string username, string password)
    {
        Console.WriteLine("Попытка авторизации пользователя"+username);
        using var connection = dataBase.GetConnection();
        using var command = new MySqlCommand("SELECT `Username` FROM `AuthData` WHERE `Username` = @U AND `Password` = @P", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@P", password);
        using var adapter = new MySqlDataAdapter(command);
        using var result = new DataTable();

        connection.Open();
        adapter.Fill(result);

        if (result.Rows.Count > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    public async Task LoadUserData(string username)
    {
        
    }
}