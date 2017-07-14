using System.Collections.Generic;
using Data.Abstractions;
using Models;
using Xunit;
using Moq;

namespace Web.Tests
{
    public class PerformanceControllerTests
    {
        [Fact]
        public void QueriesActionShouldReturnPerformanceQueryEnumerable()
        {
            var queryRepository = new Mock<IQueryRepository>();
            var sut = new Web.Controllers.PerformanceController(queryRepository.Object);

            var result = sut.Queries(2, "Foo", "Bar" );

            Assert.IsType<List<PerformanceQuery>>(result);
        }
    }
}
