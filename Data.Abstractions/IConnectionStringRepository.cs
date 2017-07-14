using System;
using System.Collections.Generic;
using System.Text;
using Models;

namespace Data.Abstractions
{
    public interface IConnectionStringRepository
    {
        WellKnownConnectionStringCheckResult CheckConnectionString(string connectionString);
    }
   
}
