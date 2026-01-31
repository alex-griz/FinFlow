using System.Data;
using MySql.Data.MySqlClient;

namespace backend;
public class Commands
{
    DataBase dataBase = new DataBase();
    public int Authorization(string username, string password)
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
            return 1;
        }
        else
        {
            return 0;
        }
    }
    public int Registration(string username, string password)
    {
        using var connection = dataBase.GetConnection();
        using var command = new MySqlCommand("SELECT `Username` FROM `AuthData` WHERE `Username` = @U");
        command.Parameters.AddWithValue("@U", username);
        using var adapter = new MySqlDataAdapter(command);
        using var result = new DataTable();

        connection.Open();
        adapter.Fill(result);
        if (result.Rows.Count > 0)
        {
            return 0;
        }
        else
        {
            command.CommandText = "INSERT INTO `AuthData` (`Username`, `Password`) VALUES (@U, @P)";
            command.Parameters.AddWithValue("@P", password);

            command.ExecuteNonQuery();
            return 1;
        }
    }
}