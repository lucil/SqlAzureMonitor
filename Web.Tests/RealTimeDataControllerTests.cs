using System.Collections.Generic;
using Data.Abstractions;
using Models;
using Moq;
using Xunit;

namespace Web.Tests
{
    public class RealTimeDataControllerTests
    {
        [Fact]
        public void QueriesActionShouldReturnPerformanceQueryEnumerable()
        {
            var realTimeRepository = new Mock<IRealTimeRepository>();
            var sut = new Web.Controllers.RealTimeDataController(realTimeRepository.Object);

            var result = sut.Cpu();

            Assert.IsType<List<RealTimePoint>>(result);
        }
    }
}