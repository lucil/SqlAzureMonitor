using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class QueryDetail
    {
        public int Spid { get; set; }
        public string HostName { get; set; }
        public string ProgramName { get; set; }
        public string LoginName { get; set; }
        public DateTime LoginTime { get; set; }
        public string SqlScript { get; set; }
    }
}
