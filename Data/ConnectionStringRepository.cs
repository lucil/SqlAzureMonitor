using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Data.Abstractions;
using Models;


namespace Data
{
    public class ConnectionStringRepository : IConnectionStringRepository
    {
        public WellKnownConnectionStringCheckResult CheckConnectionString(string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        connection.Open();
                        if (connection.State == ConnectionState.Open) // if ConnectionState.Open was successful
                        {
                            string sqlVersion;
                            using (var command = new SqlCommand(@"SELECT @@version", connection))
                            {

                                sqlVersion = command.ExecuteScalar().ToString();
                            }

                            if (!sqlVersion.Contains("Microsoft SQL Azure"))
                            {
                                return WellKnownConnectionStringCheckResult.NoSqlAzure;
                            }
                            return WellKnownConnectionStringCheckResult.Ok;
                        }
                        else
                        {
                            return WellKnownConnectionStringCheckResult.Error;
                        }
                    }
                    catch (SqlException)
                    {
                        return WellKnownConnectionStringCheckResult.Error;
                    }
                }
            }
            catch (Exception ex)
            {
                return WellKnownConnectionStringCheckResult.Error;
            }
        }
    }
}
