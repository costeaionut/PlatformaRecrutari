using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions
{
    public class FormAnswers
    {
        public int QuestionId { get; set; }
        public string CandidateId { get; set; }
        public string Answer { get; set; }
    }
}
