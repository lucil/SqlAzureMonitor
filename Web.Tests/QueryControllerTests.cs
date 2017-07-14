using System.Collections.Generic;
using Data.Abstractions;
using Models;
using Moq;
using Xunit;

namespace Web.Tests
{
    public class QueryControllerTests
    {
        [Fact]
        public void CurrentQueriesActionShouldReturnCurrentQueryEnumerable()
        {
            var queryRepository = new Mock<IQueryRepository>();
            var sut = new Controllers.QueryController(queryRepository.Object);

            var result = sut.CurrentQueries();

            Assert.IsType<List<CurrentQuery>>(result);
        }

        [Fact]
        public void WhoQueriesActionShouldReturnPerformanceQueryEnumerable()
        {
            var queryRepository = new Mock<IQueryRepository>();
            var sut = new Controllers.QueryController(queryRepository.Object);

            var result = sut.WhoQueries();

            Assert.IsType<List<SessionQuery>>(result);
        }
    }
}