using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormQuesitons
{
    public class BaseQuestion
    {
        public int Position { get; set; }
        public string Type { get; set; }
        public string Question { get; set; }
        public bool Required { get; set; }
    }
}
