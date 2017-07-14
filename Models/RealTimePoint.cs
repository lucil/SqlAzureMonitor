using System;

namespace Models
{
    public class RealTimePoint
    {
        public DateTime EndTime { get; set; }
        public decimal AvgCpuPercent { get; set; }
        public decimal AvgDataIoPercent { get; set; }
        public decimal AvgLogWritePercent { get; set; }
        public decimal AvgMemoryUsagePercent { get; set; }
        public decimal XtpStoragePercent { get; set; }
        public decimal MaxWorkerPercent { get; set; }
        public decimal MaxSessionPercent { get; set; }
        public int DtuLimit { get; set; }
    }
}
