namespace Models
{
    public class SessionQuery
    {
        public int SPID { get; set; }
        public string Status { get; set; }
        public string Login { get; set; }
        public string HostName { get; set; }
        public string BlkBy { get; set; }
        public string DBName { get; set; }
        public string Command { get; set; }
        public int CPUTime { get; set; }
        public int DiskIO { get; set; }
        public string LastBatch { get; set; }
        public string ProgramName { get; set; }
    }
}
