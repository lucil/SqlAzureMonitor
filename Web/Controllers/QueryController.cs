using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Data.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Models;


namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class QueryController : Controller
    {
        private readonly IQueryRepository _queryRepository;

        public QueryController(IQueryRepository queryRepository)
        {
            _queryRepository = queryRepository;
        }

        [HttpGet("[action]")]
        public IEnumerable<CurrentQuery> CurrentQueries()
        {
            var queries = _queryRepository.GetCurrentQueries();

            return queries;
        }

        [HttpGet("[action]")]
        public IEnumerable<SessionQuery> WhoQueries()
        {
            var queries = _queryRepository.GetWhoQueries();
            return queries;
        }

        [HttpGet("[action]")]
        public QueryDetail Detail(int queryId)
        {
            var query = _queryRepository.GetQueryDetail(queryId);
            return query;
        }

        [HttpPost("[action]")]
        public string KillQuery(int queryId)
        {
            try
            {
                _queryRepository.KillQuery(queryId);
            }
            catch (SqlException e)
            {
                return e.Message;
            }

            return String.Empty;
        }
    }
}