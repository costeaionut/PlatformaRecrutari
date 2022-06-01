using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions
{
    public class BaseQuestion
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public int Position { get; set; }
        public string Type { get; set; }
        public string Question { get; set; }
        public bool Required { get; set; }
    }
}
