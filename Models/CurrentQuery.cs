using System;

namespace Models
{
    public class CurrentQuery
    {
        public Int16 SPID { get; set; }
        public string Status { get; set; }
        public string Command { get; set; }
        public int CpuTime { get; set; }
        public int TotalElapsedTime { get; set; }
        public string Text { get; set; }

        public string TextExtract
        {
            set => Text.Substring(0, 50);
        }
    }
}
