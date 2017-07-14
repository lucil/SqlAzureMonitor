using System.Collections.Generic;
using Models;

namespace Data.Abstractions
{
    public interface IQueryRepository
    {
        QueryDetail GetQueryDetail(int queryId);
        IEnumerable<CurrentQuery> GetCurrentQueries();
        IEnumerable<SessionQuery> GetWhoQueries();
        IEnumerable<PerformanceQuery> GetPerformanceData(int numberOfQueries, string orderByField, string orderBySort);
        void KillQuery(int spid);

    }
}
