interface PerformanceQuery {
  executionCount: number;
  totalWorkerTime: number;
  averageCpuTime: number;
  totalReads: number;
  totalWrites: number;
  sqlScript: string;
  sqlExtract: string;
}