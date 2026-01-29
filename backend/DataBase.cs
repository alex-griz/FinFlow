using MySql.Data.MySqlClient;

namespace backend;
class DataBase()
{
    private string connectionString = "server=localhost; port=3306; username=root; password=root; database=FinFlowDB";
    public MySqlConnection GetConnection()
    {
        return new MySqlConnection(connectionString);
    }
}