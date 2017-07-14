using System;
using System.Data;
using System.Data.SqlClient;
using Data.Abstractions;
using Models;


namespace Data
{
    public class ConnectionStringRepository: IConnectionStringRepository
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
