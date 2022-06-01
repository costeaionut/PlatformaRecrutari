using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options
{
    public class InputsOption
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Position { get; set; }
        public string Content { get; set; }
        public int QuestionId { get; set; }
    }
}
