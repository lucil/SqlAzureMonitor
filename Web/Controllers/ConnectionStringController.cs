using System;
using System.Net.Http;
using System.Threading.Tasks;
using Data.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using System.Text.RegularExpressions;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class ConnectionStringController : Controller
    {
        private readonly IConnectionStringRepository _connectionStringRepository;

        public ConnectionStringController(IConnectionStringRepository connectionStringRepository)
        {
            _connectionStringRepository = connectionStringRepository ?? throw new ArgumentNullException(nameof(connectionStringRepository));
        }

        [HttpPost("[action]")]
        public WellKnownConnectionStringCheckResult Check([FromBody]ConnectionString connectionString)
        {
            return _connectionStringRepository.CheckConnectionString(connectionString.Value);
        }

        [HttpPost("[action]")]
        public void Add([FromBody]ConnectionString connectionString)
        {
            HttpContext.Session.SetString("ConnectionString", connectionString.Value);
        }

        [HttpGet("[action]")]
        public async Task<string> Ip()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var ip = await client.GetStringAsync("https://api.ipify.org");
                    return ip;
                }

            }
            catch { return null; }
        }
    }
}
