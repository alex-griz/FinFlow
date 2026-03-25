using System.Data;
using System.Data.SQLite;

namespace backend;
public class Commands
{
    public int Authorization(string username, string password)
    {
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("SELECT `Username` FROM `AuthData` WHERE `Username` = @U AND `Password` = @P", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@P", password);
        using var adapter = new SQLiteDataAdapter(command);
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
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("SELECT `Username` FROM `AuthData` WHERE `Username` = @U", connection);
        command.Parameters.AddWithValue("@U", username);
        using var adapter = new SQLiteDataAdapter(command);
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
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("SELECT * FROM `UsersData` WHERE `Username` = @U", connection);
        command.Parameters.AddWithValue("@U", username);
        using var adapter = new SQLiteDataAdapter(command);
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
                constant = Convert.ToInt32(data.Rows[i][4]),
                progress = data.Rows[i][5] == DBNull.Value ? 0 : Convert.ToInt32(data.Rows[i][5])
            };
        }
        return result;
    }
    public int AddItem(string username, DataObject item)
    {
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("INSERT INTO `UsersData` (`Username`, `Type`, `Name`, `Value`, `Constant`, `Progress`) VALUES (@U, @T, @N, @V, @C, @P)", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@T", item.type);
        command.Parameters.AddWithValue("@N", item.name);
        command.Parameters.AddWithValue("@V", item.value);
        command.Parameters.AddWithValue("@C", item.constant);

        if (item.type == 2)
        {
            command.Parameters.AddWithValue("@P", 0);
        }
        else
        {
            command.Parameters.AddWithValue("@P", null);
        }
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
    public int RemoveItem(string username, string name)
    {
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("DELETE FROM `UsersData` WHERE `Username` = @U AND `Name` = @N", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@N", name);
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
    public int TopupSaving(string username, string name, int value)
    {
        using var connection = new SQLiteConnection("Data Source = app.db");
        using var command = new SQLiteCommand("UPDATE `UsersData` SET `Progress` = `Progress` + @V WHERE `Username` = @U AND `Name` = @N", connection);
        command.Parameters.AddWithValue("@U", username);
        command.Parameters.AddWithValue("@N", name);
        command.Parameters.AddWithValue("@V", value);
        try
        {
            connection.Open();
            command.ExecuteNonQuery();

            DataObject dataObject = new DataObject{ constant = 0, name = "Пополнение накопления", type=1, value = value, progress = 0};
            AddItem(username, dataObject);
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
    public int progress {get; set;}
}