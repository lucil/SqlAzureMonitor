using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Data.Abstractions;
using Microsoft.AspNetCore.Http;
using Models;


namespace Data
{
    public class QueryRepository : IQueryRepository
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession Session => _httpContextAccessor.HttpContext.Session;

        public QueryRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public QueryDetail GetQueryDetail(int queryId)
        {
            var connectionString = Session.GetString("ConnectionString");

            using (var connection = new SqlConnection(connectionString))
            {
                return connection.Query<QueryDetail>(@"SELECT
                                                    sp.spid AS Spid, 
                                                    sp.hostname AS HostName, 
                                                    sp.program_name AS ProgramName, 
                                                    sp.loginame AS LoginName,
                                                    sp.login_time AS LoginTime
                                                    , CAST(text AS VARCHAR(MAX)) AS SqlScript 
                                                    FROM sys.sysprocesses sp
                                                    CROSS APPLY sys.dm_exec_sql_text (sp.sql_handle) 
                                                    WHERE SPID = @queryId", new { queryId = queryId })
                                                .FirstOrDefault();
            }
        }

        /// <summary>
        /// Ritorna le query in esecuzione in questo momento nel db
        /// </summary>
        /// <returns></returns>
        public IEnumerable<CurrentQuery> GetCurrentQueries()
        {
            var connectionString = Session.GetString("ConnectionString");
            var queries = new List<CurrentQuery>();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                //query del nostro amico pinal dave
                using (var command = new SqlCommand(@"SELECT sqltext.TEXT,
	                                                    req.session_id,
	                                                    req.status,
	                                                    req.command,
	                                                    req.cpu_time,
	                                                    req.total_elapsed_time
	                                                    FROM sys.dm_exec_requests req
	                                                    CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS sqltext
	                                                    order by total_elapsed_time DESC", connection))
                {
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();

                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        queries.Add(item: new CurrentQuery
                        {
                            SPID = (Int16)reader["session_id"],
                            Status = (string)reader["status"],
                            Command = (string)reader["command"],
                            CpuTime = (int)reader["cpu_time"],
                            TotalElapsedTime = (int)reader["total_elapsed_time"],
                            Text = (string)reader["TEXT"]
                        });
                    }
                }

            }
            return queries;
        }

        public IEnumerable<SessionQuery> GetWhoQueries()
        {
            var rows = new List<SessionQuery>();
            var connectionString = Session.GetString("ConnectionString");
            using (var connection = new SqlConnection(connectionString))
            {
                rows = connection.Query<SessionQuery>("sp_who2", commandType: CommandType.StoredProcedure).ToList();
            }

            return rows.OrderByDescending(x => x.CPUTime);
        }

        public IEnumerable<PerformanceQuery> GetPerformanceData(int numberOfQueries, string orderByField, string orderBySort)
        {
            var connectionString = Session.GetString("ConnectionString");
            using (var connection = new SqlConnection(connectionString))
            {
                return connection.Query<PerformanceQuery>(
                    @"DECLARE @NumberOfQueries INT = @top
                      DECLARE @OrderByField NVARCHAR(50) = @orderByColumn
                      DECLARE @OrderBySort NVARCHAR(5) = @orderBy

                    SELECT *
	                    , ROW_NUMBER() OVER 
			                    (
				                    ORDER BY
					                    --execution_count
					                    CASE WHEN @OrderByField = 'EXECUTION_COUNT' AND @OrderBySort = 'ASC' THEN X.ExecutionCount END ASC,
					                    CASE WHEN @OrderByField = 'EXECUTION_COUNT' AND @OrderBySort = 'DESC' THEN X.ExecutionCount END DESC,
					                    --TotalWorkerTime
					                    CASE WHEN @OrderByField = 'TOTAL_WORKER_TIME' AND @OrderBySort = 'ASC' THEN X.TotalWorkerTime END ASC,
					                    CASE WHEN @OrderByField = 'TOTAL_WORKER_TIME' AND @OrderBySort = 'DESC' THEN X.TotalWorkerTime END DESC,
					                    --AverageCpuTime
					                    CASE WHEN @OrderByField = 'AVERAGE_CPU_TIME' AND @OrderBySort = 'ASC' THEN X.AverageCpuTime END ASC,
					                    CASE WHEN @OrderByField = 'AVERAGE_CPU_TIME' AND @OrderBySort = 'DESC' THEN X.AverageCpuTime END DESC,
					                    --TotalReads
					                    CASE WHEN @OrderByField = 'TOTAL_READS' AND @OrderBySort = 'ASC' THEN X.TotalReads END ASC,
					                    CASE WHEN @OrderByField = 'TOTAL_READS' AND @OrderBySort = 'DESC' THEN X.TotalReads END DESC,
					                    --TotalWrites
					                    CASE WHEN @OrderByField = 'TOTAL_WRITES' AND @OrderBySort = 'ASC' THEN X.TotalWrites END ASC,
					                    CASE WHEN @OrderByField = 'TOTAL_WRITES' AND @OrderBySort = 'DESC' THEN X.TotalWrites END DESC
			                    )
                    FROM
                    (
	                    SELECT execution_count AS ExecutionCount
	                    , highest_cpu_queries.total_worker_time AS TotalWorkerTime
	                    , (highest_cpu_queries.total_worker_time / execution_count) AS AverageCpuTime
	                    , total_logical_reads AS TotalReads
	                    , total_logical_writes AS TotalWrites
	                    , q.[Text] AS SqlScript
	                    FROM
	                    (
		                    SELECT TOP (@NumberOfQueries) *
		                    FROM sys.dm_exec_query_stats qs
		                    ORDER BY qs.total_worker_time desc
	                    ) AS highest_cpu_queries
	                    CROSS APPLY sys.dm_exec_sql_text(plan_handle) AS q
                    ) X", new { top = numberOfQueries, orderByColumn = orderByField, orderBy = orderBySort });
            }
        }

        public void KillQuery(int spid)
        {
            var queryText = "KILL " + spid;
            var connectionString = Session.GetString("ConnectionString");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Execute(queryText);
            }
        }
    }
}
