using System.Collections.Generic;
using Models;

namespace Data.Abstractions
{
    public interface IRealTimeRepository
    {
        IEnumerable<RealTimePoint> GetAllStats();
    }
}
