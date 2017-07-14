interface RealTimeRow {
  endTime: Date;
  avgCpuPercent: number;
  avgDataIoPercent: number;
  avgLogWritePercent: number;
  avgMemoryUsagePercent: number;
  xtpStoragePercent: number;
  maxWorkerPercent: number;
  maxSessionPercent: number;
  dtuLimit: number;
}