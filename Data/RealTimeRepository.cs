using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Data.Abstractions;
using Microsoft.AspNetCore.Http;
using Models;

namespace Data
{
    public class RealTimeRepository : IRealTimeRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession Session => _httpContextAccessor.HttpContext.Session;

        public RealTimeRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Ritorna i dati di cpu per l'ultima ora
        /// </summary>
        /// <returns></returns>
        public IEnumerable<RealTimePoint> GetAllStats()
        {
            var stats = new List<RealTimePoint>();
            var connectionString = Session.GetString("ConnectionString");

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(@"SELECT * FROM sys.dm_db_resource_stats ORDER BY end_time", connection))
                {
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();

                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        stats.Add(item: new RealTimePoint
                        {
                            EndTime = (DateTime)reader["end_time"],
                            AvgCpuPercent = (decimal)reader["avg_cpu_percent"],
                            AvgDataIoPercent = (decimal)reader["avg_data_io_percent"],
                            AvgLogWritePercent = (decimal)reader["avg_log_write_percent"],
                            AvgMemoryUsagePercent = (decimal)reader["avg_memory_usage_percent"],
                            DtuLimit = (int)reader["dtu_limit"],
                            MaxSessionPercent = (decimal)reader["max_session_percent"],
                            MaxWorkerPercent = (decimal)reader["max_worker_percent"],
                            XtpStoragePercent = (decimal)reader["xtp_storage_percent"],
                        });
                    }
                }

            }
            return stats;
        }
    }
}