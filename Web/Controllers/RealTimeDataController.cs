using System.Collections.Generic;
using Data.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class RealTimeDataController : Controller
    {
        private readonly IRealTimeRepository _realTimeRepository;

        public RealTimeDataController(IRealTimeRepository realTimeRepository)
        {
            _realTimeRepository = realTimeRepository;
        }

        [HttpGet("[action]")]
        public IEnumerable<RealTimePoint> Cpu()
        {
            var statRows = _realTimeRepository.GetAllStats();

            return statRows;
        } 
    } 
}