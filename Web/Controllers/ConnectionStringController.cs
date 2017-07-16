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
        public WellKnownConnectionStringCheckResult Add([FromBody]ConnectionString connectionString)
        {
            var checkConnectionStringResult = _connectionStringRepository.CheckConnectionString(connectionString.Value);

            if(checkConnectionStringResult == WellKnownConnectionStringCheckResult.Ok) { 
                HttpContext.Session.SetString("ConnectionString", connectionString.Value);
            }

            return checkConnectionStringResult;
        }

        [HttpGet("[action]")]
        public bool IsAzureEnvironment()
        {
            return !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME"));
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
