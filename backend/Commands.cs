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
        using var command = new MySqlCommand("SELECT `Username` FROM `AuthData` WHERE `Username` = @U", connection);
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
    public DataObject[] LoadData(string username)
    {
        using var connection = dataBase.GetConnection();
        using var command = new MySqlCommand("SELECT * FROM `UsersData` WHERE `Username` = @U", connection);
        command.Parameters.AddWithValue("@U", username);
        using var adapter = new MySqlDataAdapter(command);
        using var data = new DataTable();

        connection.Open();
        adapter.Fill(data);

        DataObject[] result = new DataObject[data.Rows.Count];
        for (int i =0; i<data.Rows.Count; i++)
        {
            result[i] = new DataObject(){
                type = Convert.ToInt32(data.Rows[i][1]),
                name = data.Rows[i][2].ToString(),
                value = Convert.ToInt32(data.Rows[i][3]),
                constant = Convert.ToInt32(data.Rows[i][4])
            };
        }
        return result;
    }
    public int AddItem(string username, DataObject item)
    {
        using var connection = dataBase.GetConnection();
        using var command = new MySqlCommand("INSERT INTO `UsersData` (`Username`, `Type`, `Name`, `Value`, `Constant`) VALUES (@U, @T, @N, @V, @C)", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@T", item.type);
        command.Parameters.AddWithValue("@N", item.name);
        command.Parameters.AddWithValue("@V", item.value);
        command.Parameters.AddWithValue("@C", item.constant);

        try
        {
            connection.Open();
            command.ExecuteNonQuery();
            return 1;
        }
        catch
        {
            return 0;
        }
    }
}
public class DataObject
{
    public int type {get; set;}
    public string name {get; set;}
    public int value {get; set;}
    public int constant {get; set;}
}