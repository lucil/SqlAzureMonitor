using System;
using System.Collections.Generic;
using Data.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class PerformanceController : Controller
    {
        private readonly IQueryRepository _queryRepository;
        public PerformanceController(IQueryRepository queryRepository)
        {
            _queryRepository = queryRepository ?? throw new ArgumentNullException(nameof(queryRepository));
        }

        [HttpGet("[action]")]
        public IEnumerable<PerformanceQuery> Queries(int numberOfQueries, string orderByField, string orderBySort)
        {
            return _queryRepository.GetPerformanceData(numberOfQueries, orderByField, orderBySort);
        } 
    }
}
