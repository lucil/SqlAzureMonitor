using System;

namespace Models
{
    public class PerformanceQuery
    {
        public Int64 ExecutionCount { get; set; }
        public Int64 TotalWorkerTime { get; set; }
        public Int64 AverageCpuTime { get; set; }
        public Int64 TotalReads { get; set; }
        public Int64 TotalWrites { get; set; }
        public string SqlScript { get; set; }
        public string SqlExtract => SqlScript.Substring(0, 80);
    }
}